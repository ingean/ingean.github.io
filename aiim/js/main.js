define("dojo/_base/declare dojo/_base/array dojo/_base/lang dojo/_base/Color dojo/Deferred dojo/dom dojo/dom-class dojo/dom-style dojo/on dojo/query dijit/form/HorizontalSlider esri/geometry/geometryEngine esri/geometry/Point esri/geometry/Polyline esri/Graphic esri/layers/GraphicsLayer esri/layers/SceneLayer esri/Map esri/renderers/SimpleRenderer esri/renderers/UniqueValueRenderer esri/symbols/FillSymbol3DLayer esri/symbols/MeshSymbol3D esri/symbols/PictureMarkerSymbol esri/symbols/SimpleFillSymbol esri/symbols/SimpleLineSymbol esri/tasks/QueryTask esri/tasks/support/Query esri/views/SceneView esri/views/3d/externalRenderers esri/widgets/Search application/calculator viz/Mesh esri/WebScene esri/symbols/edges/Edges3D dojo/domReady!".split(" "),
    function(y, q, d, f, z, e, g, A, k, N, B, u, C, m, l, v, D, E, F, G, r, t, H, I, w, n, p, J, x, K, L, M, WebScene, Edges3D) {
        return y(null, {
            config: {},
            location: null,
            height: 0,
            distance: 500,
            startup: function(a) {
                var b;
                a ? (this.config = a, this._initApp()) : (a = Error("Main:: Config is not defined"), this.reportError(a), b = new z, b.reject(a), b = b.promise);
                return b
            },
            reportError: function(a) {
                g.remove(document.body, "app-loading");
                g.add(document.body, "app-error");
                var b = e.byId("loading_message");
                b && (b.innerHTML = "Unable to create map: " + a.message);
                return a
            },
            _initApp: function() {
                this.calculator =
                    new L({
                        idField: this.config.idField,
                        dateField: this.config.dateField
                    });
                this._initMap()
            },
            _initMap: function() { 
                var a = new E({
                  basemap: this.config.basemap
                })
                  , b = new t({
                    symbolLayers: [new r({
                        material: {
                            color: this.config.buildingsColor
                        }
                    })]
                })
                  , b = new F({
                    symbol: b
                });
                this.lyrBuildings = new D({
                    url: this.config.buildingsUrl,
                    renderer: b
                });
                a.add(this.lyrBuildings);
                this.lyrBuffer = new v;
                a.add(this.lyrBuffer);
                this.lyrGraphics = new v;
                a.add(this.lyrGraphics);
                this._initView(a)
            },
            _initView: function(a) {
                this.view = new J({
                    container: "panelView",
                    map: a,
                    ui: {
                        components: ["zoom"]
                    },
                    environment: {
                        atmosphereEnabled: !1,
                        starsEnabled: !1
                    },
                    camera: {
                        position: this.config.center,
                        heading: this.config.heading,
                        tilt: this.config.tilt
                    }
                });
                //this.view.then(d.hitch(this, function() { //IA: Upgraded to 4.10
                this.view.when(d.hitch(this, function() {
                    g.remove(document.body, "app-loading");
                    this._initUI();
                    this.view.popup.watch("selectedFeature", d.hitch(this, this._popupUpdated))
                }), d.hitch(this, function() {
                    this.reportError(Error("Main:: Unable to create scene"))
                }))
            },
            _initUI: function() {
                A.set("panelColor", "backgroundColor", new f(this.config.highColor));
                e.byId("txt").innerHTML = this.config.title;
                e.byId("credits").innerHTML = this.config.credits;
                k(e.byId("btnSpin"), "click", d.hitch(this, this._toggleSpin));
                k(e.byId("toggle"), "click", d.hitch(this, this._togglePanel));
                this._initSearch();
                this._initSlider();
                this._startViz()
            },
            _togglePanel: function() {
                console.log("here");
                g.toggle("panelBottom", "closed");
                e.byId("toggle").innerHTML = "-" === e.byId("toggle").innerHTML ? "+" : "-"
            },
            _initSearch: function() {
                this.searchWidget = new K({
                    view: this.view,
                    autoSelect: !1,
                    resultGraphicEnabled: !1,
                    container: "panelSearch"
                });
                k(this.searchWidget, "search-complete", d.hitch(this, this._searchComplete));
                this.searchWidget.startup()
            },
            _searchComplete: function(a) {
                console.log(a.results);
                0 < a.results.length && (this.location = a.results[0].results[0].feature.geometry, this.height = 0, this._setLocation())
            },
            _initSlider: function() {
                this.distance = this.config.distance;
                e.byId("min").innerHTML = this.config.min + " METERS";
                e.byId("max").innerHTML = this.config.max + " METERS";
                (new B({
                    id: "hs",
                    value: this.config.distance,
                    minimum: this.config.min,
                    maximum: this.config.max,
                    discreteValues: (this.config.max - this.config.min) / this.config.interval + 1,
                    intermediateChanges: !0,
                    showButtons: !1,
                    onChange: d.hitch(this, this._horizontalSliderChange)
                }, "slider")).startup()
            },
            _horizontalSliderChange: function(a) {
                this.distance = a;
                this._setBuffer()
            },
            _toggleSpin: function() {
                this.spinTimer ? this._stopSpin() : this._startSpin()
            },
            _startSpin: function() {
                this.spinTimer = setInterval(d.hitch(this, this._doSpin), 100)
            },
            _stopSpin: function() {
                this.spinTimer && (clearInterval(this.spinTimer),
                    this.spinTimer = null)
            },
            _doSpin: function() {
                this.view.goTo({
                    heading: this.view.camera.heading + .5
                })
            },
            _toggleTimer: function() {
                console.log("tog");
                g.contains("btnPlay", "playing") ? (g.remove("btnPlay", "playing"), this._stopTimer()) : (g.add("btnPlay", "playing"), this._startTimer())
            },
            _startTimer: function() {
                this._stopTimer();
                this._doTimer();
                this.timer = setInterval(d.hitch(this, this._doTimer), 1E3)
            },
            _stopTimer: function() {
                this.timer && (clearTimeout(this.timer), this.timer = null)
            },
            _doTimer: function() {
                this.slice += 1;
                this.slice >
                    this.slices && (this.slice = 0);
                this.horizontalSlider.set("value", this.slice)
            },
            _startViz: function() {
                this._getBldgInfo(this.config.startId)
            },
            _popupUpdated: function(a) {
                var b = this.config.idField;
                a && a.attributes && a.attributes[b] && (console.log("SELECTED BUILDING", a.attributes[b]), this._getBldgInfo(a.attributes[b]))
            },
            _getBldgInfo: function(a) {
                var b = this.config.idField,
                    c = new p,
                    h = new n({
                        url: this.config.footprintsUrl
                    });
                c.where = b + " = " + a;
                c.returnGeometry = !0;
                c.outFields = ["*"];
                h.execute(c).then(d.hitch(this, function(a) {
                    0 <
                        a.features.length && (a = a.features[0], this.location = a.geometry.centroid, this.height = .3048 * a.attributes.heightroof, this._setLocation())
                }))
            },
            _setLocation: function() {
                this.lyrGraphics.removeAll();
                this.lyrBuffer.removeAll();
                this._updateRenderer();
                this._removeRenderer();
                var a = this.location,
                    b = this.height,
                    c = new w({
                        color: [255, 255, 255],
                        width: 2
                    }),
                    h = new H({
                        url: "images/pin.png",
                        width: "24px",
                        height: "24px"
                    }),
                    d = new m([
                        [a.longitude, a.latitude, b],
                        [a.longitude, a.latitude, b + 150]
                    ]),
                    e = new C({
                        x: a.longitude,
                        y: a.latitude,
                        z: b +
                            150
                    }),
                    c = new l(d, c),
                    h = new l(e, h);
                this.lyrGraphics.add(c);
                this.lyrGraphics.add(h);
                a = new m([
                    [a.longitude, a.latitude, 0],
                    [a.longitude, a.latitude, b + 50]
                ]);
                /* this.view.goTo({
                    target: a,
                    scale: 5E3,
                    tilt: 40
                }); */
                this._setBuffer()
            },
            _setBuffer: function() {
                this.spinTimer && this._stopSpin();
                this.lyrBuffer.removeAll();
                this.buffer = null;
                if (this.location) {
                    var a = u.geodesicBuffer(this.location, this.distance, "meters"),
                        b = d.clone(a.rings[0]);
                    b.forEach(d.hitch(this, function(a) {
                        a[2] = this.height + 100
                    }));
                    b = new m(b);
                    b.spatialReference =
                        a.spatialReference;
                    var c = new I({
                            color: [0, 0, 0, .6],
                            outline: {
                                color: [0, 0, 0, .6],
                                width: 1
                            }
                        }),
                        h = new w({
                            color: [255, 255, 255, .3],
                            width: 4,
                            style: "solid"
                        }),
                        c = new l({
                            geometry: a,
                            symbol: c
                        }),
                        b = new l({
                            geometry: b,
                            symbol: h
                        });
                    this.lyrBuffer.add(c);
                    this.lyrBuffer.add(b);
                    this.buffer = a;
                    this._updateBuffer()
                }
            },
            _updateBuffer: function() {
                this.timerBuffer && (clearTimeout(this.timerBuffer), this.timerBuffer = null);
                this.timerBuffer = setTimeout(d.hitch(this, this._getData), 500)
            },
            _getData: function() {
                var a = this.buffer,
                    b = new p,
                    c = new n({
                        url: this.config.dataUrl
                    });
                //b.geometry = a; IA: Do not send a buffer
                b.returnGeometry = !0;
                b.orderByFields = [this.config.dateField];
                b.outFields = ["*"];
                b.where = "1 = 1"; //IA: Query all features
                c.execute(b).then(d.hitch(this, function(b) {
                    b = b.features;
                    
                    //IA: TODO: Calculate the extent of the returned features
                    
                    this._processChart(b);
                    b = this.calculator.processData({
                        extent: a.extent,
                        features: b
                    });
                    this._addRenderer(b)
                }))
            },
            _getFootprints: function(a, b) {
                var c = new p,
                    h = new n({
                        url: this.config.footprintsUrl
                    });
                c.geometry = a;
                c.returnGeometry = !0;
                c.maxAllowableOffset = 50;
                c.outFields = ["bin", "doitt_id"];
                console.time("FP");
                h.execute(c).then(d.hitch(this, function(a) {
                    a = a.features;
                    console.timeEnd("FP");
                    this._updateRenderer(b, a)
                }))
            },
            _updateRenderer: function(a, b) {
                console.time("ren");
                var c = this.config.idField,
                    h = [],
                    e = 0;
                a && q.forEach(b, function(b) {
                    var d = b.attributes[c],
                        g = b.geometry,
                        f = 0;
                    q.forEach(a, function(a) {
                        a = u.distance(g, a.geometry, 9001);
                        100 > a && (f += a / 100)
                    });
                    h.push({
                        id: d,
                        score: f
                    });
                    f > e && (e = f)
                });
                var g = new t({
                        symbolLayers: [new r({
                            material: {
                                color: this.config.buildingsColor
                            }
                        })]
                    }),
                    k = [],
                    l = new f(this.config.highColor),
                    m = new f(this.config.buildingsColor),
                    n = f.blendColors(l, new f("#000000"), .4),
                    p = f.blendColors(m,
                        new f("#ffffff"), .4);
                q.forEach(h, d.hitch(this, function(a) {
                    var b = f.blendColors(n, p, 1 - a.score / e),
                        b = new t({
                            symbolLayers: [new r({
                                material: {
                                    color: b
                                }
                            })]
                        });
                    k.push({
                        value: a.id,
                        symbol: b,
                        label: a.score
                    })
                }));
                g = new G({
                    defaultSymbol: g,
                    defaultLabel: "Buildings",
                    field: this.config.idField,
                    uniqueValueInfos: k
                });
                this.lyrBuildings.renderer = g;
                console.timeEnd("ren")
            },
            _processChart: function(a) {
                //var b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                var b = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //IA: User hours
                    c = this.config.dateField;
                q.forEach(a, function(a) {
                    //a = (new Date(a.attributes[c])).getMonth();
                    a = (new Date(a.attributes[c])).getHours(); //IA: use hours
                    b[a] += 1
                });
                this.chartData = b.slice(0);
                a = {
                    //labels: "JAN     JUN     DEC ".split(" "),
                    labels: ["00:00","","","","","","06:00","","","","","","12:00","","","","","","18:00","","","","23:00",""], //IA: use hours
                    series: [b]
                };
                this.chartIndex = 0;
                this.chart = new Chartist.Line(".ct-chart", a, {
                    showPoint: !0,
                    lineSmooth: !0,
                    axisX: {
                        showGrid: !1,
                        showLabel: !0
                    },
                    axisY: {
                        offset: 10,
                        showGrid: !1,
                        showLabel: !1
                    },
                    fullWidth: !0,
                    chartPadding: {
                        left: -10,
                        right: 0
                    },
                    width: "300px",
                    height: "200px",
                    low: 0,
                    showArea: !0
                });
                this.chart.on("draw", d.hitch(this, function(a) {
                    "point" === a.type && a.index === this.chartIndex && a.element.addClass("ct-pulse")
                }))
            },
            _updateStats: function(a) {
                var b = a.slice;
                this.chartIndex = b;
                a = this.chartData[b] || 0;
                //b = this.config.months[b];
                b = this.config.hours[b]; //IA: Use hours
                //e.byId("subtitle").innerHTML = "<span class='big'>" + b + "</span> " + this.config.subtitle + " " + this.distance + " meter";
                e.byId("subtitle").innerHTML = this.config.subtitle + " " + "<span class='big'>" + b;
                e.byId("odometer").innerHTML = a;
                this.chart.update()
            },
            _addRenderer: function(a) {
                this._removeRenderer();
                this.renderer = new M(this.view, {
                    height: 400,
                    color1: this.config.highColor,
                    color2: this.config.buildingsColor,
                    vertices: a.vertices,
                    indices: a.indices,
                    data: a.data
                });
                this.signal = k(this.renderer, "update", d.hitch(this, this._updateStats));
                x.add(this.view, this.renderer)
            },
            _removeRenderer: function() {
                this.renderer && (this.signal && (this.signal.remove(), this.signal = null), x.remove(this.view, this.renderer));
                this.renderer = null
            }
        })
    });