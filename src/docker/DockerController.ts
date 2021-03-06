import { logCmd } from "../helper/log";
import cliSpinners from "cli-spinners"
import execSh from "exec-sh"
import { Command } from "commander"
import inquirer from 'inquirer';

const execShPro = execSh.promise;


enum OptionAction {
    ChooseFunction = "ChooseFunction"
}
class DockerController {
    async setup() {
        logCmd.start({
            snippet: cliSpinners.dots2,
            text: "Check docker"
        })
        await logCmd.awaitTimeOut(2000)
        logCmd.clear()
        const result = await execShPro(`sudo docker --version`).catch(err => null);
        if (!result) {
            await execShPro(`sudo apt-get update`).catch(err => null);
            await execShPro(`sudo apt-get install \
            apt-transport-https \
            ca-certificates \
            curl \
            gnupg \
            lsb-release`).catch(err => null);
            await execShPro(`sudo apt install curl`).catch(err => null);
            await execShPro(`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg`).catch(err => null);
            await execShPro(`echo \
            "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
            $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`).catch(err => null);
            await execShPro(`sudo apt-get update`).catch(err => null);
            await execShPro(`sudo apt-get install docker-ce docker-ce-cli containerd.io`).catch(err => null);
            await execShPro(`sudo apt-cache madison docker-ce`).catch(err => null);
            logCmd.done({
                text: "Docker has installed"
            })
        } else {
            logCmd.done({
                text: "Docker is already installed"
            })

        }
        return
    }

    async installPostgres(): Promise<any> {
        const data = await inquirer.prompt([{
            type: "input",
            message: "Enter username",
            name: "username",
        }, {
            type: "input",
            message: "Enter password",
            name: "password",
        }, {
            type: "input",
            message: "Enter database name",
            name: "database",
        }, {
            type: "input",
            message: "Enter docker name",
            name: "dockerName",
        }, {
            type: "input",
            message: "Enter port",
            name: "port",
        }])
        const params = data

        await this.setup();
        logCmd.warn({
            text: "Start postgres database with docker"
        })
        await execShPro(`sudo docker run --name ${params.dockerName} -p 5432:${params.port || 5432}  -e POSTGRES_USER=${params.username} -e POSTGRES_PASSWORD=${params.password} -e POSTGRES_DB=${params.database} -d postgres`).catch(e => null)
        logCmd.done({
            text: "Done postgres database with docker"
        })
    }
    async installMySql(): Promise<any> {
        const data = await inquirer.prompt([{
            type: "input",
            message: "Enter username",
            name: "username",
        }, {
            type: "input",
            message: "Enter password",
            name: "password",
        }, {
            type: "input",
            message: "Enter database name",
            name: "database",
        }, {
            type: "input",
            message: "Enter docker name",
            name: "dockerName",
        }, {
            type: "input",
            message: "Enter port",
            name: "port",
        }])
        const params = data

        await this.setup();
        logCmd.warn({
            text: "Start postgres database with docker"
        })
        await execShPro(``).catch(e => null)
        logCmd.done({
            text: "Done postgres database with docker"
        })
    }
}

export const dockerController = new DockerController();