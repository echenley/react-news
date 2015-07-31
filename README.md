# React-News

## About

**Note: Due to the popularity of this project, I am bumping up against the limits of my Firebase account. If it's unresponsive, that's probably why. If you fork the project, please sign up for a [free Firebase account](https://www.firebase.com/pricing.html) and update the URL in `util/constants.js`!**

This is a real-time Hacker News clone written using [React](http://facebook.github.io/react/), [RefluxJS](https://github.com/spoike/refluxjs), and a [Firebase](http://firebase.com) backend.

## Demo

[![React-News](http://henleyedition.com/content/images/2015/02/Screen-Shot-2015-02-22-at-10-59-05-PM.png)](http://henleyedition.com/react-news/)

Demo available [here](http://henleyedition.com/react-news/).

Test User Login:  
email: reactnews@example.com  
password: henleyedition1

## Development and Build Process

To start the development server, run `npm i && npm start` and have at the `src/`. Files are served from `/build`.

| Command | Description |
| ------- | ----------- |
| `npm start` | Starts development server |
| `npm run build` | Runs build task without starting server |
| `npm run dist` | Strips sourcemaps and minifies assets into `/dist` folder |
| `npm run lint` | Lint the `/src` folder |

## Firebase Structure

`$` are Firebase-generated unique IDs.

```
├── comments
│   └── $commentId
│       ├── creator (username)
│       ├── creatorUID ($userId)
│       ├── postId ($postId)
│       ├── postTitle
│       ├── text
│       ├── time
│       └── upvotes
├── posts
│   └── $postId
│       ├── commentCount
│       ├── creator (username)
│       ├── creatorUID ($userId)
│       ├── time
│       ├── title
│       ├── upvotes
│       └── url
└── users
    └── $userId
        ├── md5hash
        ├── upvoted
        │   └── $itemId ($postId or $commentId)
        └── username
```

## Firebase Security Rules

```javascript
{
  "rules": {

    "posts": {
      // anyone can view posts
      ".read": true,
      ".indexOn": ["upvotes", "creatorUID", "commentCount", "time"],

      "$id": {
        // auth can't be null to make/edit post
        // if the post exists, auth.uid must match creatorUID
        ".write": "(auth != null && !data.exists()) || data.child('creatorUID').val() === auth.uid",
          
        // make sure all 5 fields are present before saving a new post
        // leave 'isDeleted' when deleting a post
        ".validate": "newData.hasChildren(['title', 'url', 'creator', 'creatorUID', 'time']) ||
                      newData.hasChildren(['isDeleted'])",

        // title must be a string with length>0
        "title": {
          ".validate": "newData.isString() && newData.val().length > 0"
        },
        "url": {
          ".validate": "newData.isString()"
        },
        "creator": {
          ".validate": "newData.isString()"
        },
        "creatorUID": {
          ".validate": "auth.uid === newData.val() && root.child('users/' + newData.val()).exists()"
        },
        "commentCount": {
          // commentCount must be writable by anyone logged in
          ".write": "auth != null",
          // 1st line: initial write
          // 2nd line: only alterable by 1
          // 3rd line: if deleted
          ".validate": "(!data.exists() && newData.val() === 1) ||
                        (newData.val() - data.val() === 1 || newData.val() - data.val() === -1) ||
                        !newData.exists()"
        },
        "upvotes": {
          // upvotes must be writable by anyone logged in
          ".write": "auth != null",
          // 1st line: initial write
          // 2nd line: cannot go below 0 and only alterable by 1
          ".validate": "(!data.exists() && newData.val() === 1) ||
                        (newData.val() >= 0 && (newData.val() - data.val() === 1 || newData.val() - data.val() === -1))"
        }
      }
    },

    "comments": {
      ".read": true,
      ".indexOn": ["postId","creatorUID","time"],
      
      "$comment_id": {
        ".write": "auth != null && (!data.exists() || data.child('creatorUID').val() === auth.uid)",
        ".validate": "newData.hasChildren(['postId', 'text', 'creator', 'creatorUID', 'time']) &&
                      (newData.child('text').isString() && newData.child('text').val() != '')",
        
        "upvotes": {
          // upvotes must be writable by anyone logged in
          ".write": "auth != null",
          // 1st line: initial write
          // 2nd line: cannot go below 0 and only alterable by 1
          ".validate": "(!data.exists() && newData.val() === 1) ||
                        (newData.val() - data.val() === 1 || newData.val() - data.val() === -1)"
        }
      }
    },

    "users": {
      ".read": true,
      ".indexOn": ["username"],

      "$uid": {
        // user not authenticated until after profile is created
        ".write": "!data.exists()",
        "upvoted": {
          "$postId": {
            ".write": "auth.uid === $uid"
          }
        }
      }
    },

    // Don't let users post to other fields
    "$other": { ".validate": false }

  }
}
```