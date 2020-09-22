window.toTriggerScript = function() {
    var scripts = document.getElementsByTagName("script"),
    arr = [];
    for (var i = 0; i < scripts.length; i++) {
        var src = scripts[i].src;
        console.log('script:', src);
        if (!!src) {
            if (src.indexOf('page_init') >= 0) {
                continue
            } //--禁止自身
            var script = document.createElement("script");
            script.defer = 'defer';
            script.type = "text/javascript";
            script.src = src;
        } else {
            var script = document.createElement("script");
            script.type = "text/javascript";
            script.innerText = scripts[i].innerText;
        }
        var obj = {
            index: i,
            script: script,
            stept: arr.length
        };
        arr.push(obj);
        obj.init = function() {
            var me = this,
            script1 = scripts[me.index],
            script = me.script;
            if (!script1) {
                var next = arr[me.stept * 1 + 1];
                if (next) {
                    next.init();
                }
                return;
            }
            script1.parentNode.insertBefore(script, script1); //--将克隆后的元素插入原元素之前
            script1.parentNode.removeChild(script1); //--删除原元素
            if ( !! script.src) {
                script.onload = function() {
                    console.log('onload:', script.src);
                    var next = arr[me.stept * 1 + 1];
                    if (next) {
                        next.init();
                    }
                };
            } else {
                var next = arr[me.stept * 1 + 1];
                if (next) {
                    next.init();
                }
            }
        };
    }
    arr[0].init();
};