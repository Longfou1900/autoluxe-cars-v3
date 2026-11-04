// Declarative pipeline for AutoLuxe (React + Vite).
//
// Option A (default): Docker Pipeline plugin — runs every stage inside node:24.
// Option B: NodeJS plugin — replace the `agent { docker ... }` block with
//           `agent any` and add:  tools { nodejs 'node24' }
//           (configure "node24" under Manage Jenkins > Tools > NodeJS).
//
// Required plugins: Pipeline, Docker Pipeline (option A) or NodeJS (option B),
//                   JUnit, Timestamper, Workspace Cleanup.

pipeline {
  agent {
    docker {
      image 'node:24-alpine'
      args '-u root'
    }
  }

  options {
    timestamps()
    timeout(time: 15, unit: 'MINUTES')
    disableConcurrentBuilds()
    buildDiscarder(logRotator(numToKeepStr: '10'))
  }

  environment {
    CI = 'true'
    npm_config_cache = "${WORKSPACE}/.npm"
  }

  stages {

    stage('Clone Code') {
            steps {
                git 'https://github.com/Longfou1900/autoluxe-cars-v3.git'
            }
        }
    stage('Build Image') {
            steps {
                sh """
                docker build -t jenkins/jenkins:lts-jdk25 -f prod.Dockerfile . 
                """
            }
    }

    stage('Deploy') {
            steps {
               sh """
                docker rm -f jenkins || true
                docker run -dp 3005:80 --name jenkins jenkins/jenkins:lts-jdk25
               """
            }
    }

    stage('Install') {
      steps {
        sh 'node --version && npm --version'
        sh 'npm ci'
      }
    }

    stage('Typecheck') {
      steps {
        sh 'npm run typecheck'
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test:ci'
      }
      post {
        always {
          junit allowEmptyResults: true, testResults: 'reports/junit.xml'
        }
      }
    }

    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Archive') {
      steps {
        archiveArtifacts artifacts: 'dist/**', fingerprint: true
      }
    }
  }

  post {
    success {
      echo 'AutoLuxe build passed. Production bundle archived from dist/.'
    }
    failure {
      echo 'AutoLuxe build failed. Check the stage logs above.'
    }
    cleanup {
      cleanWs()
    }
  }
}
