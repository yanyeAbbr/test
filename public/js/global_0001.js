const $$ = {
    _iframe: function (button,url) {
        let btn = button.text('刷新中，请稍等...');
        let iframe = $('<iframe src="' + url + '" style="width: 100%; height: 150px" scrolling="no" frameborder="0"></iframe>');
        iframe.load(function () {
            $$.frameAutoHeight(iframe);
            btn.replaceWith('');
        });
        button.after(iframe);
    },
    tabBtnLoad: function () {
        // 初始化tab
        let hash = $('a[data-toggle="tab"].active')[0].hash.split('#')[1];
        let $th = $('#'+hash+'').children('button');
        $$._iframe($th,$th.attr('data-src'));
        // 点击 tab
        $('a[data-toggle="tab"]').on('click',function () {
            let href = $(this).attr('href');
            let id = href.split('#')[1];
            let $this = $('#'+id+'').children('button');
            let url = $this.attr('data-src');
            $$._iframe($this,url);
        })
    },
    btnFrame: function (id) {
        $(id).click(function () {
            $$._iframe($(this), $(this).attr('data-src'));
        });
    },
    frameAutoHeight: function (frame) {
        (function ($frame) {
            var lastHeight = 0, curHeight = 0;
            var setHeight = function () {
                curHeight = $frame.contents().find('body').height();
                if (curHeight < 300) {
                    curHeight = 300;
                }
                if (curHeight != lastHeight) {
                    //$frame.css('height', (lastHeight = curHeight) + 'px');
                    $frame.css({height: (lastHeight = curHeight) + 'px'});
                }
            };
            setHeight();
            setInterval(setHeight, 300);
        })(frame);
    }
}