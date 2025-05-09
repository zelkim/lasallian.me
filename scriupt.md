Explain how the posts are implemented

For creating posts, it is created with content as the only required field. The other optional fields are the title, media url, post type (like normal, project, or event) and visibility levels like public, private, or organization. 

The user in the post can also have select a badge when they create a post. Hashtags are also implemented in the post by checking the content and parsing it with regex to look for the hashtags. 

Futhermore, we can filter the posts via the search functionality by searching the hashtag or any word included in the post you want to search.

Once it is created, other users can comment and react to that post as we demonstrated earlier.

Moreover, the post author is the  currently authenticated user that created the post, which will be automatically referenced by the backend by checking the session token of the user. This is also the same when we are editing or updating the post.

