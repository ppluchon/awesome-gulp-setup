'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var _ = require('lodash');
var slug = require('slug');
var fs = require('fs');

module.exports = yeoman.Base.extend({
  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the stupendous \n' + chalk.red('PROXIMITY') + '\n Gulp Generator!'
    ));

    var prompts = [
    {
      type:'input',
      name:'appName',
      message:"What would you like to name your app/site?",
      default:"New Project"
    },
    {
      type:'checkbox',
      name:'features',
      message:'What features do you want inside?',
      choices: [
        {
          name:'include jQuery ?',
          value:'includeJquery',
          checked: false
        },
        {
          name:'include Bower ?',
          value:'includeBower',
          checked: false
        },
        {
          name:'Es6 flavour with Babel + Webpack ?',
          value:'includeBabel',
          checked: true
        },
        {
          name:'Feeling brave? Want Eslint?',
          value:'includeEslint',
          checked:false
        },
        {
          name:'optimize your graphic assets ?',
          value:'includeImagemin',
          checked: true
        },
        {
          name:'A neat webserver with browser-sync : '+chalk.green('Learn more at https://browsersync.io'),
          value:'includeBrowsersync',
          checked: true
        }
      ]
    },
    {
      when:function(props) {
        return _.includes(props.features, 'includeEslint')
      },
      type:'list',
      name:'eslintRules',
      message : 'Choose your Eslint rules',
      choices : [
        "Airbnb",
        "StandardJS"
      ]
    },
    {
      when:function(props) {
        return _.includes(props.features, 'includeBrowsersync')
      },
      type:'confirm',
      name:'vhost',
      message : 'Do you have a Vhost already setup (ie : for server side language maybe?)',
      default:false
    },
    {
      when: function(props)
      {
        return (props.vhost != undefined )? props.vhost: props.vhost;
      },
      type:'input',
      name:'vhostName',
      message:'Nice, tell me your URL : ',
      default: 'www.mywebsite.dev'
    }

    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      // console.log(this.props)
      // To access props later use this.props.someOption;
      this.appName = this.props.appName;
      this.includeJquery = _.includes(this.props.features, 'includeJquery');
      this.includeBower = _.includes(this.props.features, 'includeBower');
      this.includeBabel = _.includes(this.props.features, 'includeBabel');
      this.includeEslint = _.includes(this.props.features, 'includeEslint');
      this.includeImagemin = _.includes(this.props.features, 'includeImagemin');
      this.includeWebserver = _.includes(this.props.features, 'includeBrowsersync');
      this.linterParser = (this.props.eslintRules != undefined) ? this.props.eslintRules : ''; 
      this.hasVhost = (this.props.vhost != undefined)? this.props.vhost : false;
      this.vhostName = (this.props.vhostName != undefined)? this.props.vhostName: '';
      done();
    }.bind(this));
  },

  writing: function () {
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('public/index.html'),
      {
        appName : this.appName,
        includeJquery : this.includeJquery
      }
    );
    //DON'T COPY JQUERY IF NOT NEEDED
    if(this.includeJquery)
    {
      this.fs.copy(
        this.templatePath('jquery.min.js'),
        this.destinationPath('public/vendor/jquery.min.js')
      );
    }

    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        appName : slug(this.appName).toLowerCase(),
        description : "",
        includeImagemin : this.includeImagemin
      }
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      {
        Eslint : this.includeEslint
      }
    );
    this.fs.copyTpl(
      this.templatePath('webpack.production.config.js'),
      this.destinationPath('webpack.production.config.js'),
      {
        Eslint : this.includeEslint
      }
    );   
    if(this.includeBabel)
    {
      this.fs.copyTpl(
        this.templatePath('gulpfile.babel.js'),
        this.destinationPath('gulpfile.js'),
        {
          appName : this.appName,
          includeWebserver : this.includeWebserver,
          hasVhost : this.hasVhost,
          vhostName : this.vhostName,
          Eslint : this.includeEslint,
          includeImagemin : this.includeImagemin
        }
      );
      this.fs.copy(
        this.templatePath('src/es6/main.js'),
        this.destinationPath('src/js/main.js')
      );
      this.fs.copy(
        this.templatePath('src/es6/Point.js'),
        this.destinationPath('src/js/Point.js')
      );
    } else {
      this.fs.copyTpl(
        this.templatePath('gulpfile.js'),
        this.destinationPath('gulpfile.js'),
        {
          appName : this.appName,
          includeWebserver : this.includeWebserver,
          hasVhost : this.hasVhost,
          vhostName : this.vhostName,
          Eslint : this.includeEslint,
          includeImagemin : this.includeImagemin
        }
      );
      this.fs.copy(
        this.templatePath('src/es5/main.js'),
        this.destinationPath('src/js/main.js')
      );
      
    }
    if(this.includeImagemin)
    {
      this.fs.copy(
        this.templatePath('src/assets/proximity.png'),
        this.destinationPath('src/assets/proximity.png')
      )
    }
    this.fs.copy(
        this.templatePath('src/scss/main.scss'),
        this.destinationPath('src/scss/main.scss')
      );
    if(this.includeEslint) {
      this.fs.copyTpl(
        this.templatePath('_eslintrc.json'),
        this.destinationPath('.eslintrc.json'),
        {
          parser : this.linterParser
        }
      );
    }
    if(this.includeBower)
    {
      this.fs.copyTpl(
        this.templatePath('bower.json'),
        this.destinationPath('bower.json'), 
        {
          appName : this.appName
        }
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
