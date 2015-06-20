# React-News

![React-News](http://henleyedition.com/content/images/2015/02/Screen-Shot-2015-02-22-at-10-59-05-PM.png)

## About

This is a Hacker News clone written using [React](http://facebook.github.io/react/), [RefluxJS](https://github.com/spoike/refluxjs), and a [Firebase](http://firebase.com) backend.

## Demo

Demo available [here](http://henleyedition.com/reactnews/).

Test User Login:  
email: reactnews@example.com  
password: henleyedition1

## Development

After cloning, just `cd` in there, run `npm install` and `gulp` and have at the `src/` folder.

## Firebase Security Rules

It was requested that I post my Firebase security rules. Hope this helps!

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
          
        // We want to make sure that all 5 fields are present before saving a new post
        ".validate": "newData.hasChildren(['title','url','creator','creatorUID', 'time'])",

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
          // only alterable by 1
          ".write": "auth != null",
          ".validate": "(!data.exists() && newData.val() === 1) ||
                        (newData.val() - data.val() === 1 || newData.val() - data.val() === -1)"
        },
        "upvotes": {
          // upvotes must be writable by anyone logged in
          // only alterable by 1
          // cannot go below 0
          ".write": "auth != null",
          ".validate": "(!data.exists() && newData.val() === 1) ||
                        (newData.val() > 0 && (newData.val() - data.val() === 1 || newData.val() - data.val() === -1))"
        }
      }
    },

    "comments": {
      ".read": true,
      ".indexOn": ["postId", "creatorUID", "time"],
      
      "$comment_id": {
        ".write": "auth != null && (!data.exists() || data.child('creatorUID').val() === auth.uid)",
        ".validate": "newData.hasChildren(['postId','text','creator','creatorUID', 'time']) &&
                      (newData.child('text').isString() && newData.child('text').val() != '')",
        
        "upvotes": {
          // upvotes must be writable by anyone logged in
          // only alterable by 1
          ".write": "auth != null",
          ".validate": "(!data.exists() && newData.val() === 1) ||
                        (newData.val() - data.val() === 1 || newData.val() - data.val() === -1)"
        }
      }
    },

    "users": {
      ".read": true,
      ".indexOn": ["username"],

      "$uid": {
        ".write": "!data.exists() && auth.uid === $uid",
        "upvoted": {
          "$postId": {
            ".write": "auth.uid === $uid"
          }
        }
      }
    },

    "user_history": {
      ".read": true,

      "$uid": {
        // only the user can write here
        ".write": "auth.uid === $uid"
      }
    },

    // Don't let users post to other fields
    "$other": { ".validate": false }

  }
}
```