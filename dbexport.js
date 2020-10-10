
module.exports = mainfn;
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
function makeurl(baseurl,params,apiKey){
    var geturl = "" + baseurl;
    for(var index in params){
        geturl = geturl + index + "=" + params[index].toString() + "&";
    }
    geturl = geturl + "apiKey=" + apiKey;
    return geturl
}
function getmenu(params) {
    var apiKey = "5e39bdba2f6b49af9e51c5daf5df177f";
    var baseurl = "https://api.spoonacular.com/recipes/findByNutrients?";
    var priority = [["minCalories","maxCalories"],["minCarbs","maxCarbs"],["minProtein","maxProtein"],["minFat","maxFat"]];
    var prioritylevel = 1;

    while(prioritylevel<5){
        var threshitem = 7;
        var url = makeurl(baseurl,params,apiKey);
        var request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.send(null);
        if (request.status === 200) {
            menulist = JSON.parse(request.responseText);
        }
        if (menulist.length > threshitem){
                //console.log("prioritylevel: " + prioritylevel.toString());
                //console.log("NO. of food:" + menulist.length.toString());
                return menulist;
        }
        else{
            delete params[priority[priority.length-prioritylevel][0]];
            delete params[priority[priority.length-prioritylevel][1]];
            prioritylevel = prioritylevel+1;
            //console.log(params);
        }
    }
    console.log("food not found!");
    return [];
}
function getsuggestion(calorieperday,Carbs,Protein,Fat) {
    var breakfast=35/100;
    var lunch=40/100;
    var dinner=20/100;

    var breakfast_req = [(1/4)*(calorieperday)*Carbs*breakfast,
                (1/4)*(calorieperday)*Protein*breakfast,
                (1/9)*(calorieperday)*Fat*breakfast,
                calorieperday*breakfast];
    var bfParams = {
        "minCalories":breakfast_req[3]-25,
        "maxCalories":breakfast_req[3]+25,
        "minCarbs":breakfast_req[0]-10,
        "maxCarbs":breakfast_req[0]+10,
        "minProtein":breakfast_req[1]-10,
        "maxProtein":breakfast_req[1]+10,
        "minFat":breakfast_req[2]-10,
        "maxFat":breakfast_req[2]+10,
        "number":10
    };
    var lunch_req = [(1/4)*(calorieperday)*Carbs*lunch,
        (1/4)*(calorieperday)*Protein*lunch,
        (1/9)*(calorieperday)*Fat*lunch,
        calorieperday*lunch];
    var lunchParams = {
        "minCalories":lunch_req[3]-25,
        "maxCalories":lunch_req[3]+25,
        "minCarbs":lunch_req[0]-10,
        "maxCarbs":lunch_req[0]+10,
        "minProtein":lunch_req[1]-10,
        "maxProtein":lunch_req[1]+10,
        "minFat":lunch_req[2]-10,
        "maxFat":lunch_req[2]+10,
        "number":10
    };
    var dinner_req = [(1/4)*(calorieperday)*Carbs*dinner,
        (1/4)*(calorieperday)*Protein*dinner,
        (1/9)*(calorieperday)*Fat*dinner,
        calorieperday*dinner];
    var dinnerParams = {
        "minCalories":dinner_req[3]-25,
        "maxCalories":dinner_req[3]+25,
        "minCarbs":dinner_req[0]-10,
        "maxCarbs":dinner_req[0]+10,
        "minProtein":dinner_req[1]-10,
        "maxProtein":dinner_req[1]+10,
        "minFat":dinner_req[2]-10,
        "maxFat":dinner_req[2]+10,
        "number":10
    };

    //Actual api call
    var BFMenu = getmenu(bfParams);
    //console.log(BFMenu);
    var LUNMenu = getmenu(lunchParams);
    //console.log(LUNMenu);
    var DINMenu = getmenu(dinnerParams);
    //console.log(DINMenu);
return [BFMenu,LUNMenu,DINMenu];
}
function filter(menulist){
    var threshitesm = 10;
    var x1 =menulist[0].length;
    var x2 =menulist[1].length;
    var x3 =menulist[2].length;

    if(x1 > threshitesm && x2>threshitesm && x3>threshitesm ){
        menulist[0] = menulist[0].filter(a => !menulist[1].includes(a) && !menulist[2].includes(a));
        menulist[1] = menulist[1].filter(a => !menulist[0].includes(a) && !menulist[2].includes(a));
        //console.log(menulist);
        return menulist;
    }
    if(x1>threshitesm && x2>threshitesm){
        menulist[0] = menulist[0].filter(a => !menulist[1].includes(a) && !menulist[2].includes(a));
        menulist[1] = menulist[1].filter(a => !menulist[0].includes(a) && !menulist[2].includes(a));
        //console.log(menulist);
        return menulist;
    }
    if(x1>threshitesm && x3>threshitesm){
        menulist[0] = menulist[0].filter(a => !menulist[1].includes(a) && !menulist[2].includes(a));
        menulist[2] = menulist[2].filter(a => !menulist[0].includes(a) && !menulist[1].includes(a));
        //console.log(menulist);
        return menulist;
    }
    if(x2>threshitesm && x3>threshitesm){
        menulist[1] = menulist[1].filter(a => !menulist[0].includes(a) && !menulist[2].includes(a));
        menulist[2] = menulist[2].filter(a => !menulist[0].includes(a) && !menulist[1].includes(a));
        //console.log(menulist);
        return menulist;
    }
    if(x1>threshitesm){
        menulist[0] = menulist[0].filter(a => !menulist[1].includes(a) && !menulist[2].includes(a));
        //console.log(menulist);
        return menulist;
    }
    if(x2>threshitesm){
        menulist[1] = menulist[1].filter(a => !menulist[0].includes(a) && !menulist[2].includes(a));
        //console.log(menulist);
        return menulist;
    }
    if(x3>threshitesm){
        menulist[2] = menulist[2].filter(a => !menulist[0].includes(a) && !menulist[1].includes(a));
        //console.log(menulist);
        return menulist;
    }
    //console.log(menulist);
    return menulist;
}
function mainfn(calorieperday,Carbs,Protein,Fat){
    var threshitem = 10;
    var MasterMenu = getsuggestion(calorieperday,Carbs,Protein,Fat);
    //console.log(MasterMenu);
    filteredmenulist = filter(MasterMenu);
    //console.log(filteredmenulist);
    var FinalMenuList =[];
    if(MasterMenu[0].length > threshitem && filteredmenulist[0].length < threshitem){
        FinalMenuList.push(MasterMenu[0]);
    }else{
        FinalMenuList.push(filteredmenulist[0]);
    }
    if(MasterMenu[1].length > threshitem && filteredmenulist[1].length < threshitem){
        FinalMenuList.push(MasterMenu[1]);
    }else{
        FinalMenuList.push(filteredmenulist[1]);
    }
    if(MasterMenu[2].length > threshitem && filteredmenulist[2].length < threshitem){
        FinalMenuList.push(MasterMenu[2]);
    }else{
        FinalMenuList.push(filteredmenulist[2]);
    }

    return FinalMenuList;
    // console.log(FinalMenuList);
    //final output => FinalMenuList
}
