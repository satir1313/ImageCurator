# ***********  Image Annoatator  *********** #

Image annoatator appliocation is a web base application that provide a user friendly user interface for end user to annotate images and store them in the databse.
# How to run Image Annotator

** Note: With this approach, you wont need to replace any code inside the UI files. If you want to use a different user and password to connect to the database, you will have to change the code where these credentials are used (.env, config.js, and knexfile.js) **

1. Clone to Bitbucket Repository in following link: git clone https://Shahabj13@bitbucket.org/Shahabj13/machine-learning-curator.git

2. Run command git checkout UI_Gateway_API in the root directory of the repository

3. Make sure postgresql is installed with commands:
    - sudo apt update -y
    - sudo apt install postgresql postgresql-contrib -y

4. Install knex globally with commands:
    - sudo npm install -g knex --save
    - sudo npm install -g pg

5. Run the following commands to get the database created
    - sudo -i -u postgres psql
    - createuser --interactive:
        - name = sha13
        - Shall the new role be a superuser? = y
    - createdb shieldtec
    - type "psql" to get into the psql command prompt and enter the following commands:
        - ALTER USER sha13 WITH PASSWORD '123456';

6. Inside new terminal window run the following commands:
    - sudo adduser sha13
    - sudo -i -u sha13
    - psql -d shieldtec
    - Know if you run command "\c shieldtec" you should be able to connect to the shieldtec database

7. Open a new terminal and navigate to the machine-learning-curator repository (ensure you are in the UI_Gateway_API branch), and run the following commands:
    - knex migrate:latest

8. In the same terminal window as in step 5, run the following commands:
    - alter table login_user add column login_time timestamp;
    - alter table login_user alter column login_time set default now();
    - \d login_user - you should now see id, email, password_digest, logout_time, login_time columns

9. Run the UI with commands in the root directory of the repository:
    - npm install
    - npm run dev

10. Navigate to localhost:4056 and you should now be able to sign up and log in

Application will run the UI on port 4056 and Gateway Api will run on port 4057 on the local host.

# How to use User Interface

First a user must register his/her details. after successful registration, user will be able to use his/her credentials to login to application and use image annotating tool and other functionality.

# How to access Gateway API

Gateway API runs simultaneously with UI on localhost:4057. in the address bar of the browser write "http://localhost:4057/api/images" to receive stored images in the database in Json format. other data can be retrieved from database via API are:

/image/id ** id of image in the database eg. 1 **
/login_users ** will be removed later **
/layers
/layer/id ** id of layer in the database eg. 1 **
/users
/user/is ** id of user in the database eg. 1 **

# Connection to ML server and Image server for Object Detection tool

To connect to Machine Learning server use the following addresses:

/ml_connection: Returns a guild to options provided by ML server
/ml_connction/status: Returns status of ML in Json format
/ml_connction/progress: Returns the status of learning progress