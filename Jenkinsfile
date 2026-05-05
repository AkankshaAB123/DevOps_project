pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/AkankshaAB123/DevOps_project.git'
            }
        }

        stage('Build') {
            steps {
                echo 'Installing backend dependencies...'
                echo 'Installing frontend dependencies...'
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying application...'
            }
        }
    }
}