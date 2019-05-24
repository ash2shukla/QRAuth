# Procom Frontend

### Tech stack
1. Angular 6
2. Angular Material with Teradata Covalent
3. js-sha256
4. js-xlsx
5. ng-animate

## Directory Overview
```
.
├── README.md (main readme)  
|  
└── procom-frontend (angular root-dir)  
    ├── e2e (end to end tests using protractor)  
    ├── node_modules (installed dependencies)  
    ├── angular.json (angular workspace config)  
    ├── tsconfig.json (typescript config for editors)  
    ├── tslint.json (typescript linting config)  
    ├── package.json (node dependencies index)  
    |  
    └── src (source files root)  
        |  
        ├── app (main application source files)    
        |   |
        |   ├── core ( services and components vital for app eg. storage service / mock api / authguards )
        |   |   ├── services  
        |   |   |   ├── logging.service (service that exposes logs) *can be used to throw logs to a DB or server as well  
        |   |   |   └── storage.service (service interface to session and localstorage with useful methods)
        |   |   └── log (log component to see simple logs in HTML) *will be removed in future  
        |   |
        |   ├── shared ( shared services and modules eg. MaterialModules )  
        |   |   ├── auth-guard.service (protects lazy loading of dashboard)  
        |   |   ├── intercept-auth.service (intercepts HTTP calls and adds authorization headers also refreshes token and repeats request)  
        |   |   └── logout.service ( Logs a user out Locally and From Server)  
        |   |   
        |   ├── dashboard* ( main user app )
        |   |   └── board-layout ( component to arrange other components in a proper layout outlets the dashboards routes )  
        |   |
        |   ├── home* ( landing page )  
        |   |   └── home-layout ( component to arrange other components in a proper layout )
        |   |  
        ##### A module will be added per feature eg. signin, signup ####   
        |   |  
        |   ├── signin  
        |   |   ├── form-signin ( form signin component ) 
        |   |   ├── qr-sigmin ( qr signin compoent )  
        |   |   ├── signin-services  
        |   |   └── signin-models  
        |   |
        |   ├── signup  
        |   |   ├── form-signup ( main signup component )  
        |   |   ├── signup.modles  
        |   |   └── signup-services  
        |   |
        |   ├── sheet-rw ( read/write excel files and send to socket )
        |   |   ├── sheet-rw-main  
        |   |   ├── sheet-rw.model  
        |   |   └── sheet-rw.service
        |   |
        |   ├── products* ( product dashboard #child of: dashboard module )
        |   |   └── product-layout
        |   |
        |   ├── orders* ( order dashboard #child of: dashboard module )
        |   |   └── order-layout
        |   |
        |   └── app.component ( outlets the routes )  
        |   
        ├── environments (environment variables eg. API_URL etc.)  
        ├── assets (static data ie. images)  
        ├── main.ts (loads AppModule and sets environment)  
        ├── polyfills.ts  
        ├── test.ts (setup testBed for all .ts files corresponding to a regex)  
        ├── styles.scss (global css)  
        ├── tsconfig.app.json (typescript config for .ts files)  
        ├── tsconfig.spec.json (typescript config for .spec.ts files)  
        ├── tslint.json (src scoped typescript linting)
        └── karma.conf.js (test runner configuration)  

* = module is lazy loaded; other modules just export their components
```

## Additional Notes

#### Install angular dependencies
```npm install```

## Start Notes
Run backend.
```ng serve --host 0.0.0.0 --port 4200```

## Documentation

## Testing

### Running  Tests
