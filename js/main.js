class ViewMainPage {
    constructor(myf) {
        this.myf = myf;
    }
    showDevices(list) {
        // cargo la lista de objetos en el DOM
        let devicesUl = this.myf.getElementById("devicesList");
        let items = "";
        for (let i in list) {
            let checkedStr = "";
            if (list[i].state == "1")
                checkedStr = "checked";
            switch (list[i].type) {
                case 0: // Lampara                     
                    items += "<li class='collection-item avatar'> \
                                <img src='images/lightbulb.png' alt='' class='circle'> \
                                <span class='title'>" + list[i].name + "</span> \
                                <p>" + list[i].description + "<br> \
                                </p> \
                                <a href='#!' class='secondary-content'> <div class='switch'> \
                                                                            <label> \
                                                                            Off \
                                                                            <input type='checkbox' id='dev_" + list[i].id + "' " + checkedStr + "> \
                                                                            <span class='lever'></span> \
                                                                            On \
                                                                            </label> \
                                                                        </div></a> \
                            </li>";
                    break;
                case 1: // Persiana                    
                    items += "<li class='collection-item avatar'> \
                                <img src='images/window.png' alt='' class='circle'> \
                                <span class='title'>" + list[i].name + "</span> \
                                <p>" + list[i].description + "<br> \
                                </p> \
                                <a href='#!' class='secondary-content'> <div class='switch'> \
                                                                            <label> \
                                                                            Off \
                                                                            <input type='checkbox' id='dev_" + list[i].id + "' " + checkedStr + "> \
                                                                            <span class='lever'></span> \
                                                                            On \
                                                                            </label> \
                                                                        </div></a> \
                            </li>";
                    break;
            }
        }
        devicesUl.innerHTML = items;
    }
    getSwitchStateById(id) {
        let el = this.myf.getElementById(id);
        return el.checked;
    }
    //Devuelve el tipo de elemento del, bien sea un switch o un boton de filtro    
    getTipoElemento(id) {
        if (id.startsWith("dev_")) {
            return 'switch';
        }
        if (id.startsWith("btn_filter")) {
            return 'btn_filter';
        }
        return 'otro';
    }
    getTipoFiltro(id) {
        return id.substr(-1);
    }
}
class Main {
    handleEvent(evt) {
        let elem = this.myf.getElementByEvent(evt);
        //Para los id del tipo dev_XXX son los switchs
        //Para los id del tipo btn_filter son los filtros de dispositivos
        let tipo = this.view.getTipoElemento(elem.id);
        if (tipo == 'switch') {
            console.log("click en device:" + elem.id);
            let data = { "id": elem.id, "state": this.view.getSwitchStateById(elem.id) };
            this.myf.requestPOST("devices", data, this);
        }
        else if (tipo == 'btn_filter') {
            let opcionfiltro = this.view.getTipoFiltro(elem.id);
            this.myf.requestGET("devices?filter=" + opcionfiltro, this);
        }
    }
    handleGETResponse(status, response) {
        if (status == 200) {
            console.log(response);
            let data = JSON.parse(response);
            console.log(data);
            this.view.showDevices(data);
            for (let i in data) {
                //let sw:HTMLElement = this.myf.getElementById("dev_"+data[i].id);
                //sw.addEventListener("click",this);     
                this.myf.configClick("dev_" + data[i].id, this);
            }
        }
    }
    handlePOSTResponse(status, response) {
        if (status == 200) {
            console.log(response);
        }
    }
    main() {
        this.myf = new MyFramework();
        this.view = new ViewMainPage(this.myf);
        //this.myf.requestGET("devices?filter=0",this);
        this.myf.requestGET("devices", this);
        //Agrego metodo configClick en el framework para simplificar la configuraicon y reusar codigo   
        this.myf.configClick('btn_filter_todo_0', this);
        this.myf.configClick('btn_filter_lampara_1', this);
        this.myf.configClick('btn_filter_persiana_2', this);
    }
}
window.onload = () => {
    let obj = new Main();
    obj.main();
};
