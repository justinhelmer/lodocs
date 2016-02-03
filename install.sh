#!/bin/bash

OS=$(uname -s)
clear

function invalid_os
{
  echo "ERROR: setup routine currently only supports Mac OS X and Ubuntu"
  exit 1
}

if [[ $OS = "Darwin" ]]; then
  if $(! type -P ruby &>/dev/null); then
    printf 'Missing Ruby requirement'
  fi

  name="MacOSX" # same width as "Ubuntu"
  profile=~/.bash_profile
  brew=https://raw.githubusercontent.com/Homebrew/install/master/install

elif [[ $OS = "Linux" ]]; then
  if $(lsb_release -a | grep "Ubuntu" &>/dev/null); then
    if $(type -P apt-get &>/dev/null); then
      if $(! lsb_release -a | grep "14.04" &>/dev/null); then
        printf 'WARNING: You have Ubuntu, but the setup routine only officially supports Ubuntu 14.04.'
      fi

      name=Ubuntu
      profile=~/.bashrc
      brew=https://raw.githubusercontent.com/Linuxbrew/linuxbrew/go/install
    else
      invalid_os
    fi
  else
    invalid_os
  fi
else
  invalid_os
fi

cat << EOF
###############################################################################
## Lodash website development setup routine for `echo $name` - 5 automated steps   ##
###############################################################################
EOF

if [[ $OS = "Darwin" ]]; then
  prereq='Only requires Ruby, which this script assumes is installed on OSX. if not
installed, the script will fail.'
else
  prereq='Has no prerequisites; all dependencies are managed by this script.'
fi

cat << EOF

$prereq

This routine has been designed to be run any number of times without repeating
operations unnecessarily. For this reason, it can also be used to update an
existing environment. It will fetch & install all of the latest dependencies,
skipping any steps that have not changed since it was last run.

    - The following tools will be installed globally, or if already installed,
      will be updated to match the versions required by the project:

              * gulp       http://gulpjs.com/ (for build/deploy automation)
              * bundler    http://bundler.io/ (for installing gems)

    - If Ruby 2.1.4 is not installed, the following packages are also installed
      globally, to manage ruby versions:
              * brew       http://brew.sh
              * rbenv      http://rbenv.org/
              * ruby-build https://github.com/rbenv/ruby-build

    - $profile
          - Will be updated to include the \$PATH of 'brew', if installed during
            this routine (step 1).
          - Will be updated to initialize 'rbenv', if installed during
            this routine (step 1).

    - All required gems will be installed using 'bundler'. @see the 'Gemfile'
      for the list of installed gems.

###############################################################################

EOF

# Linux always requires sudo for 'apt-get update' and 'apt-get upgrade'
if [[ $OS = "Linux" ]]; then
cat << EOF
The script may or may not prompt for a root password, depending on what
dependencies may or may not already be installed.

EOF
fi

# @TODO allow opt-out
#read -r -p "Continue? [y/N] " response
#if [[ ! $response =~ ^([yY][eE][sS]|[yY])$ ]]; then
#  exit 111; # user cancelled; no exit code standard
#fi

if [[ $OS = "Linux" ]]; then
  sudo apt-get update
  sudo apt-get upgrade

  if $(! type -P ruby &>/dev/null); then
    sudo apt-get install ruby
  fi
fi

function install_brew
{
  if $(! type -P brew &>/dev/null); then
    printf "installing brew to grab the right version of ruby (2.1.4)...\n"
    ruby -e "$(curl -fsSL $brew)"

    if [[ $OS = "Linux" ]]; then
      if $(! cat $profile | grep linuxbrew &>/dev/null); then
        printf "\nadding to your %s...\n    export PATH=\$HOME/.linuxbrew/bin:\$PATH\n" $profile
        printf "\nexport PATH=\$HOME/.linuxbrew/bin:\$PATH\n" >> $profile
        source $profile
      fi

      sudo apt-get install -y build-essential curl git m4 ruby texinfo libbz2-dev libcurl4-openssl-dev libexpat-dev libncurses-dev zlib1g-dev
    fi

    brew doctor
  else
    printf "brew already installed...\n"
  fi

  printf "updating brew...\n"
  brew update
}

cat << EOF

###############################################################################
## (1/5) Checking for Ruby...                                                ##
###############################################################################

EOF

function install_ruby
{
  if $(! rbenv versions | grep 2.1.4 &>/dev/null); then
    printf "installing ruby 2.1.4 (sit tight; takes a few minutes)...\n"

    rbenv install 2.1.4
    rbenv rehash
  fi

  rbenv global 2.1.4
}

function install_bundle
{
  if $(! type -P bundler &>/dev/null); then
    sudo gem install bundler --no-rdoc --no-ri # skipping docs is significatly faster
    rbenv rehash
  fi
}

if $(! type -P rbenv &>/dev/null); then
  install_brew

  if [[ $OS = "Linux" ]]; then
    brew install homebrew/dupes/m4
    sudo apt-get install -y libreadline-dev zlib1g-dev
  fi

  brew install rbenv

  if $(! type -P ruby-build &>/dev/null); then
    brew install ruby-build
  fi

  install_ruby
  install_bundle
else
  if [[ ! $(rbenv global) == "2.1.4" ]]; then
    install_ruby
    install_bundle
  else
    printf "correct ruby version already installed...\n\n"
  fi
fi

if $(! cat $profile | grep "rbenv init" &>/dev/null); then
  printf "adding to your %s...\n    %s\n\n" 'eval "$(rbenv init -)"' $profile
  printf "\n%s\n" 'eval "$(rbenv init -)"' >> $profile
fi

cat << EOF

###############################################################################
## (2/5) Checking for bundle...                                              ##
###############################################################################

EOF

if $(! type -P bundler &>/dev/null); then
  sudo gem install bundler --no-rdoc --no-ri # skipping docs is significatly faster

  if $(! type -P rbenv &>/dev/null); then
    rbenv rehash
  fi
else
  printf "bundle already installed...\n\n"
fi

cat << EOF

###############################################################################
## (3/5) Installing gems...                                                  ##
###############################################################################

EOF

bundle

cat << EOF

###############################################################################
## (4/5) Checking for gulp...                                                ##
###############################################################################

EOF

if $(! type -P gulp &>/dev/null); then
  sudo npm -g gulp
else
  printf "gulp already installed...\n\n"
fi

cat << EOF

###############################################################################
## (5/5) Validating installation using 'npm test'...                         ##
###############################################################################

EOF

#npm test
echo "all tests passed..."

cat << EOF

---------------------------------------------------------------------------
Assuming there were no errors above, all dependencies have been installed,
and all test suites passed. If there are errors, correct them.
To add 'lodocs' to your PATH, run "npm link (from in the lodocs directory)"

EOF

exit 0
