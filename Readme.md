# ***********  Image Annoatator  *********** #
Image annoatator appliocation is a web base application that provide a user friendly user interface for end user to annotate images and store them in the databse.

# How to run Image Annotator
1- clone to Bitbucket Repository in following link: git clone https://Shahabj13@bitbucket.org/Shahabj13/machine-learning-curator.git


2- If using VS code, open terminal (ctrl+shift+`)

3- In terminal run command: npm install

4- In terminal run command: npm dev run

Application will run the UI on port 4056 and Gateway Api will run on port 4057 on the local host.

# How to use User Interface

First a user must register his/her details. after successful registration, user will be able to use his/her credentials to login to application and use image annotating tool and other functionality.

# How to access Gateway API

Gateway API runs simultaneously with UI on localhost:4057. in the address bar of the browser write "http://localhost:4057/api/images" to receive stored images in the database in Json format. other data can be retrieved from datanse via API are:

/image/id ** id of image in the database eg. 1 **
/login_users ** will be removed later **
/layers
/layer/id ** id of layer in the database eg. 1 **
/users
/user/is ** id of user in the database eg. 1 **


# Connection to ML server and Image server for Object Detection tool