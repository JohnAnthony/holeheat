(function() {

var Prop = function() {
	return {
		value: "",
		setValue: function(v) {state.value = v}
	}
};

var MAP;
var MARKER;
var POSTCODE = new Prop();
var DEPTH = new Prop();
var COORDINATES;
var YIELD;

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

					MARKER = new google.maps.Marker({
						map: MAP,
						title: 'Closest wellbore data'
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
						COORDINATES = undefined;
						YIELD = undefined;

						m.request({
							url: window.API_LOCATION + '/borehole/search/0/0'
						})
						.then(function(result) {
							var pos = {
								lat: result.coordinates[0],
								lng: result.coordinates[1],
							};

							COORDINATES = pos.lat + 'N ' + pos.lng + 'E';
							MARKER.setPosition(pos);
							MAP.setCenter(pos);
							MAP.setZoom(15);
						});
					}
				}, 'SEARCH')
			)
		),
		m('hr'),
		m('h3', 'Wellbore information'),
		m('.row',
			m('.six.columns',
				m('span', 'Estimated Yield: '),
				m('span', YIELD || '--'),
				m('span', ' kWh')
			),
			m('.six.columns',
				m('span', 'Coordinates: '),
				m('span', COORDINATES || '--')
			)
		)
	);
};

document.addEventListener('DOMContentLoaded', function() {
	m.mount(document.body, { view: VIEW });
});

})();
