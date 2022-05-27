const conf = new (require("conf"))();
const chalk = require("chalk");
const fs = require("fs");
function react(task, action, dir) {
  const actions = task.split(" ");
  const root = process.cwd();
  const directories = action.split("/");
  let prevDirectory = "";

  if (task === "service") {
    return generateService(action, dir);
  }

  // var testPath = root + "/templates";
  // console.log(testPath);
  // console.log(fs.existsSync(testPath));

  // return;
  for (const directory of directories) {
    prevDirectory += `/${directory}`;

    if (!fs.existsSync(`${root}${prevDirectory}`)) {
      console.log("creating directory", `${root}${prevDirectory}`);
      fs.mkdirSync(`${root}${prevDirectory}`);
    }
  }

  //create file
  const modulePath = `${root}${prevDirectory}/${task}`;

  if (fs.existsSync(modulePath)) {
    console.log(chalk.yellow(`Folder ${task} already exists`));
    return;
  } else {
    //create directory
    fs.mkdirSync(modulePath);
  }
  var templatePath = root + "/templates";
  var templateControllerDir = `${__dirname}/../template/react/ModuleController.model`;
  var templateModelDir = `${__dirname}/../template/react/Module.model`;

  if (fs.existsSync(`${templatePath}/ModuleController.model`)) {
    templateControllerDir = `${templatePath}/ModuleController.model`;
  }

  if (fs.existsSync(`${templatePath}/Module.model`)) {
    templateModelDir = `${templatePath}/Module.model`;
  }

  //read template controller
  fs.readFile(templateControllerDir, { encoding: "utf-8" }, (err, data) => {
    var filtered = data;
    filtered = filtered.replace(new RegExp(`\\#module#`, "gm"), task);
    fs.writeFileSync(`${modulePath}/${task}Controller.js`, filtered);
    console.log("Generating controller");
  });

  fs.readFile(templateModelDir, { encoding: "utf-8" }, (err, data) => {
    var filtered = data;
    filtered = filtered.replace(new RegExp(`\\#module#`, "gm"), task);

    fs.writeFileSync(`${modulePath}/${task}.jsx`, filtered);
    console.log("Generating view");
  });
}

function generateService(action, directory) {
  console.log("Generate service...");
  const servicePath = `${__dirname}/../template/rn/${action}.model`;

  if (!fs.existsSync(servicePath)) {
    console.log(chalk.yellow(`Service ${action} doesnt exists`));
    return;
  }

  if (!fs.existsSync(`${process.cwd()}/${directory}`)) {
    console.log(chalk.yellow(`Directory ${directory} doesnt exists`));
    return;
  }

  fs.copyFileSync(servicePath, `${process.cwd()}/${directory}/${action}.js`);
}
module.exports = react;
