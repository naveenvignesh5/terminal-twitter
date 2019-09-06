# **Terminal Twitter**

Simple CLI tool based on node to operate twitter from command line.

### **How to use**

#### Login and Logout

```shell
$ twcmd -l
```

![Demo](https://raw.githubusercontent.com/naveenvignesh5/twitter-cmd/master/assets/auth.gif)

```shell
$ twcmd --logout
```

#### Sending a tweet

```shell
$ twcmd -t "hello world !!!"
```

### Sending a tweet with media

```shell
$ twcmd -t "hello world !!!" -m ~/Pictures/sample.png

$ twcmd -t "hello world !!!" -m ~/Movies/sample_movie.mp4
```

### List favorite tweets

```shell
$ twcmd -f -t
```

### Listening to tweets

```shell
$ twcmd --track "some text"
```

#### Example 
![Track](https://raw.githubusercontent.com/naveenvignesh5/twitter-cmd/master/assets/track.gif)

### Searching for tweets

```shell
$ twcmd -s "trump"
```

The entire API on how to use is [here](API.md)

### **Development Environment Setup**

```shell
$ git clone git@github.com:naveenvignesh5/twitter-cmd.git

$ npm i

$ mv api.json.template api.json # update consumer key and secret from twitter dashboard

$ npm link
```

### **Running the Project**

```shell
$ node index.js

or

$ npm start
```
