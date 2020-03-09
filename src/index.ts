#!/usr/bin/env node
"use strict";

import chalk from 'chalk'
import inquirer from 'inquirer'
import path from 'path'
import yargs from 'yargs'

// output prettify config
const heading = chalk.white.bgCyan
const body = chalk.green
const bold = chalk.cyan.bold

const argv = yargs.option('resume', {
                alias: 'r',
                description: 'Path to resume json file',
                type: 'string',
            })
            .nargs('r', 1)
            .demandOption(['r'])
            .help()
            .alias('help', 'h')
            .argv;



function resumeInteractor() {
    inquirer.prompt(resumeChoices)
        .then(resume => {
            if (resume.choice === "Exit") {
                return
            }

            const choice = resume.choice
            if (choice === "All") {
                resumePresenter()
            } else {
                resumeSectionPresenter(resumeData[choice], choice)
            }

            inquirer
                .prompt({
                    type:"list",
                    name:"exitBack",
                    message:"Go back or exit?",
                    choices:["Back","Exit"]
                })
                .then(choice=>{
                    if (choice.exitBack === "Back"){
                        resumeInteractor();
                    } else {
                        return;
                    }
                })

        })
}

function resumePresenter() {
    Object.keys(resumeData).forEach((resumeSectionName, index) => {
        if (index === 0) {
            console.log(bold("=".repeat(process.stdout.columns)))
        }
        const resumeSection = resumeData[resumeSectionName]
        console.log("\n")
        console.log(heading(resumeSectionName))
        console.log("\n")
        resumeSection.forEach(data => {
            console.log(body(data))
        })
        console.log("\n")
        console.log(bold("=".repeat(process.stdout.columns)))
    })
}

function resumeSectionPresenter(resumeSection: Array<any>, type: string): void {
    // TODO: Add type for each section to beautify the output
    
    console.log(bold("=".repeat(process.stdout.columns)))
    console.log("\n")
    console.log(heading(type))
    console.log("\n")
    resumeSection.forEach(data => {
        console.log(body(data))
    })
    console.log("\n")
    console.log(bold("=".repeat(process.stdout.columns)))
}

function main() {
    resumeInteractor()
}


if (argv.resume) {
    const resumeFilePath = path.resolve(argv.resume)

    var resumeData = require(resumeFilePath)

    var resumeChoices = {
        type: "list",
        name: "choice",
        message:"What do you want to know about me?",
        choices:["All", ...Object.keys(resumeData), "Exit"]
    }

    main()
}

