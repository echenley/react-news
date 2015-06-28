# React-News

![React-News](http://henleyedition.com/content/images/2015/02/Screen-Shot-2015-02-22-at-10-59-05-PM.png)

## About

This is a real-time Hacker News clone written using [React](http://facebook.github.io/react/), [RefluxJS](https://github.com/spoike/refluxjs), and a [Firebase](http://firebase.com) backend.

## Demo

Demo available [here](http://henleyedition.com/react-news/).

Test User Login:  
email: reactnews@example.com  
password: henleyedition1

## Development

`npm i && gulp` and have at the `src/`.

## Firebase Structure

`$` are Firebase-generated unique IDs.

```
| comments
| -- $commentId
|    | -- creator
|    | -- creatorUID
|    | -- postId
|    | -- postTitle
|    | -- text
|    | -- time
|    | -- upvotes
| Posts
| -- $postId
|    | -- commentCount
|    | -- creator
|    | -- creatorUID
|    | -- time
|    | -- title
|    | -- upvotes
|    | -- url
| Users
| -- $userId
|    | -- md5hash
|    | -- upvoted
|    |    | -- $itemId
|    | -- username
```

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
          
        // make sure all 5 fields are present before saving a new post
        // leave 'isDeleted' and 'commentCount' when deleting a post
        ".validate": "newData.hasChildren(['title', 'url', 'creator', 'creatorUID', 'time']) ||
                      (newData.hasChildren(['isDeleted', 'commentCount']) &&
                      newData.child('commentCount').val() == data.child('commentCount').val())",

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
          // only alterably by 1 (or 0 when post is deleted)
          ".write": "auth != null",
          ".validate": "(!data.exists() && newData.val() === 1) ||
                        (newData.val() - data.val() === 0 || newData.val() - data.val() === 1 || newData.val() - data.val() === -1)"
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
      ".indexOn": ["postId","creatorUID","time"],
      
      "$comment_id": {
        ".write": "auth != null && (!data.exists() || data.child('creatorUID').val() === auth.uid)",
        ".validate": "newData.hasChildren(['postId', 'text', 'creator', 'creatorUID', 'time']) &&
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
        // user not authenticated until after profile is created
        ".write": "!data.exists()",
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