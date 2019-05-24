# Procom Backend

### Tech stack
1. Django with DRF and Channels
2. PostgreSQL


## Directory Overview
```
.
├── README.md (main readme)  
├── db_containers  
├── Pipfile   
├── Pipfile.lock   
|  
└── procom_backend (django root dir)  
    ├── manage.py  
    ├── db.sqlite3  
    |  
    └── procom_backedn (root app)  
        |  
        ├── jwt_auth (Main Authentication app contains all authentication and User Profile logic for HTTP and WS)  
        |   ├── admin.py  
        |   ├── apps.py  
        |   ├── auth_backend.py (EmailMobileBackend, JWTAuthentication, JWTAuthChannelsMiddleware)  
        |   ├── consumers.py (Channels consumers- Auth and Anon)  
        |   ├── models.py (mainprofile, metaprofile, send_verification_mail andr send_verification_mail**)  
        |   ├── tests.py (Signup form and authflow test)  
        |   ├── serializers.py (Validation forms for views)  
        |   ├── views.py (Business logic for api only - no to nill validation)  
        |   ├── utils.py (Utility functions used in views.py)
        |   └── urls.py
        |   
        ├── gi.py (main gateway interface file, contains asgi and wsgi app both)  
        ├── routes.py (async routes)  
        ├── urls.py (sync routes)  
        └── settings.py (configs)  
```
 
** send_verification_mail should be declared in [utils.py](procom_backend/jwt_auth/utils.py) but as utils imports from [models.py](procom_backend/jwt_auth/models.py) it will be a circular import.
## Additional Notes
cd to corresponding dir before executing commands else use -f RELATIVE_FILE_PATH

**1. Start postgres/redis ->**  ```docker-compose up -d```  
**2. Stop postgres/redis ->** ```docker-compose down```  
**3. Collect Logs from Postgres ->** ```docker-compose logs postgresql```  
**4. Collect Logs for redis ->** ```docker-compose logs redis```  
**5. Log in to Postgres ->** ```docker-compose exec postgres bash```  
**6. Log in to Redis ->** ````docker-compose exec redis bash```  


#### Install python dependencies
```pipenv install```

## Start Notes
.backend >  
1. up postgres and redis ```docker-compose -f db_containers/docker-compose.yml up -d```  
2. activate virtualenv ```pipenv shell```  
3. start django ```python procom_backend/manage.py runserver```
2.3. Alternative command - ```pipenv run python manage.py runserver```

## Documentation

1. start server
2. Navigate to-> /docs
   
## Testing
Write Transactional Tests only. Live tests will be done on frotend using Karma and Jasmine

### Running Transactional tests
```python manage.py test```
