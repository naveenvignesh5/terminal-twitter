### Commands and Users

1. Login to twitter and Logout

```shell
$ twcmd -l

$ twcmd --login

$ twcmd --logout
```

2. Make a tweet

```shell
$ twcmd -t "hello world !!!"

$ twcmd -t "text" -m /path/to/media # tweet with media
```

3. List tweets

```shell
$ twcmd -t -f # List favorite tweets

$ twcmd -t -s "search query" # Search and list specific tweets
```

4. Search Users and List User Information

```shell
$ twcmd -u -s "search query"

$ twcmd -u "screen name" -i 
```

5. Track tweets from stream

```shell
$ twcmd --track "#hashtag or @username"
```

6. List followers and friends
   
```shell
$ twcmd --followers "screen_name" # list a user's followers

$ twcmd --followers # list your followers

$ twcmd --friends "screen_name" # list a user's friends

$ twcmd --friends # list your friends

$ twcmd --friends --request # list your friend requests
```
