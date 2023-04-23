console.log("######## prepare ########");

const fs = require('fs');
const path = require('path');

const HOLIDAY_CN_DIR = "./3rd/holiday-cn";
const HOLIDAY_CN_OUTPUT = "./static/holiday-cn.json"

function travelDir(dir, subdir = false) {
    let holidayCnJsonList = [];
    function __travelDir(dir, subdir = false) {
        fs.readdirSync(dir).forEach((file) => {
            var pathname = path.join(dir, file)
            if (fs.statSync(pathname).isDirectory() && subdir) {
                travel(pathname, subdir = subdir)
            } else if (fs.statSync(pathname).isFile()) {
                holidayCnJsonList.push(pathname)
            }
        })
    }
    __travelDir(dir, subdir = subdir);
    return holidayCnJsonList;
}

const holidayCnJsonList = travelDir(HOLIDAY_CN_DIR).filter(filePath => filePath.match("^.*\.json$"));

console.log(holidayCnJsonList);

let holidayCnData = [];

holidayCnJsonList.forEach(
    path => {
        var data = fs.readFileSync(path, "utf-8");
        holidayCnData.push(JSON.parse(data.toString()));
    }
)

fs.writeFileSync(HOLIDAY_CN_OUTPUT, JSON.stringify(holidayCnData))


