# **Twitter Command Bot**

Simple CLI tool based on node to access twitter data from command line.

### **Development Environment Setup**

```shell
$ git clone git@github.com:naveenvignesh5/twitter-cmd.git

$ npm i

$ mv .env.template .env # update consumer key and secret from twitter dashboard

$ npm link
```

### **Running the Project**

```shell
$ node index.js

or

$ npm start
```

### **How to use**

#### Sending a tweet

```shell
$ twcmd -t "hello world !!!"
```

#### Login and Logout


```shell
$ twcmd --logout
```