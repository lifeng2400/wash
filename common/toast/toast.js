var t;

module.exports = {
    showToastMsg: function(s, a, e, o) {
        var i = this;
        clearTimeout(t), a = a || 3e3;
        var r = {
            toastMsg: s
        };
        r.toastTitle = o || !1, this.setData(r), t = setTimeout(function() {
            i.setData({
                toastMsg: !1
            }), e && e();
        }, a);
    }
};