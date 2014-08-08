# A modern grunt build script

This is my static HTML project boilerplate.

## Setup grunt

1. Run `$ grunt/setup.sh` to install grunt and all required node_modules
2. Configure your project `grunt/package.json`
3. Setup ftp-accounts `.ftppass:`

```
{
    "development": {
        "username": "username",
        "password": "password"
    }
}
```

### Available grunt tasks

- default:      Watch Sass development
- compile:      Validate and compile Sass to CSS
- deploy:       Deploy project
- deploy-prod:  Deploy project and upload to production server
- destroy:      Clean development directory and remove old distributions
- dev:          Watch Sass and JavaScript development
- speed:        Test your project with yslow
- validate:     Validate JS, JSON, PHP and Sass