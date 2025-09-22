# 🏅 Olympic Games Dashboard — Student Project (OpenClassrooms)

![Angular](https://img.shields.io/badge/Angular-19.2.15-red)
![Node.js](https://img.shields.io/badge/Node.js-22.18.0-green)
![ngx-charts](https://img.shields.io/badge/ngx--charts-22.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-lightgrey)
![Status](https://img.shields.io/badge/status-Completed-brightgreen)

This Angular project aims to build an interactive dashboard displaying:
- Global data such as the number of Olympic editions and the number of participating countries
- A PieChart showing the total number of medals per country

Then, through dynamic navigation triggered by clicking on a chart segment, the user is redirected to a detailed view showing:
- Country-specific data such as the number of Olympic participations, total medals won, and number of athletes
- A BarChart displaying the number of medals per year for the selected country

The data is structured as nested JSON, with country-level entries containing participations and statistics for each Olympic edition.

Using ngx-charts allows me to map this data directly without complex transformations, which simplifies development and reduces the risk of errors

## Prerequisites
Before getting started, make sure the following tools are installed on your machine:

- **Node.js (here v22.18.0 LTS at the time)**

    ➤ [Download Node](https://nodejs.org/en/download)


- **Angular (here v19.2.15 LTS at the time)**

    This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.3 and upgraded to version 19.2.15

    Install the Angular CLI globally:

    > npm install -g @angular/cli@19.2.15


- **Recommended IDE : Visual Studio Code as the development environment**

    ➤ [Download Visual Studio Code](https://code.visualstudio.com)


To check the version :

    > node -v
    > ng version


Don't forget to install your node_modules before starting (`npm install`).

## Project setup

- Clone the repository from the following address :
```bash
> git clone https://github.com/ZeckLab/OC-P2-olympic-medals.git
> cd OC-P2-olympic-medals
```

- Install your node_modules before starting :
```bash
> npm install
```

## Dependency check

Make sure the following line is present in your package.json file under dependencies:

    "@swimlane/ngx-charts": "^22.0.0"

This ensures that the correct version of ngx-charts will be installed when running npm install.
If you're unsure, open the package.json file and verify that the version matches.

If the version is missing or incorrect, run:
```bash
> npm install @swimlane/ngx-charts@22.0.0 --save
```

## Run the application

Start the development server :
```bash
> npm start
```

Then open your browser at `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Technical Notes

This project was originally generated using **Angular v14**, and later upgraded to **v18**, then to **v19.2.15**.

At the time of development, Angular's **standalone components** were not yet adopted in this project.  
Instead, the application architecture is based on **NgModules**, which was the standard approach in earlier Angular versions.

As a result, the project uses **RxJS Observables** for reactive data flow, rather than Angular **Signals**, which were introduced more recently.

To keep the code clean and memory-safe, Observables are handled using the `async` pipe in templates, without manual `subscribe()` calls.  
This approach ensures:
- Automatic subscription management  
- Simplified component logic  
- Reduced risk of memory leaks
