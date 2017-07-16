(function() {

var MAP;
var MARKER;
var POSTCODE = 'NR3 2RB';
var DEPTH = '100';
var COORDINATES;
var YIELD;
var OPERATIONAL_HOURS = [1800, 2400];

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
					value: POSTCODE,
					onchange: m.withAttr('value', function(v) { POSTCODE = v; })
				})
			),
			m('.six.columns',
				m('label', 'Borehole Depth (m)'),
				m('input.u-full-width', {
					value: DEPTH,
					onchange: m.withAttr('value', function(v) { DEPTH = v; })
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
						.then(function(borehole) {
							var pos = {
								lat: borehole.coordinates[0],
								lng: borehole.coordinates[1],
							};

							COORDINATES = pos.lat + 'N ' + pos.lng + 'E';
							MARKER.setPosition(pos);
							MAP.setCenter(pos);
							MAP.setZoom(15);

							m.request({
								url: window.API_LOCATION + '/borehole/:id/yield/:l/:h',
								data: {
									id: borehole._id,
									l: DEPTH || 0,
									h: 2400
								}
							})
							.then(function(yield) {
								YIELD = yield;
							});
						});
					}
				}, 'SEARCH')
			)
		),
		m('hr'),
		m('h3', 'Nearest Wellbore'),
		m('.row',
			m('.six.columns',
				m('span', 'Estimated Yield: '),
				m('span', YIELD || '--'),
				m('span', ' kWh (\u00A3'),
				m('span', YIELD ? (YIELD * 0.052).toFixed(2) : '--'),
				m('span', ')')
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
