(function() {

var Prop = function() {
	return {
		value: "",
		setValue: function(v) {state.value = v}
	}
};

var MAP;
var POSTCODE = new Prop();
var DEPTH = new Prop();


var VIEW = function() {
	return m('.container',
		m('.row', 
			m('h2.title','BHE Yield Calculator')
		),
		m('.row',
			m('#map', {
				oncreate: function(vnode) {
					MAP = new google.maps.Map(document.getElementById('map'), {
						center: {lat: 54.55, lng: -5.93},
						zoom: 6
					});
				}
			})
		),
		m('.row',
			m('.six.columns',
				m('label', 'Postcode'),
				m('input.u-full-width', {
					value: POSTCODE.value,
					onchange: m.withAttr('value', POSTCODE.setValue)
				})
			),
			m('.six.columns',
				m('label', 'Borehole Depth'),
				m('input.u-full-width', {
					value: DEPTH.value,
					onchange: m.withAttr('value', DEPTH.setValue)
				})
			)
		),
		m('.row',
			m('.one.columns',
				m('button.button-primary', {
					onclick: function() {
					}
				}, 'SEARCH')
			)
		)
	);
};

document.addEventListener('DOMContentLoaded', function() {
	m.mount(document.body, { view: VIEW });
});

})();
