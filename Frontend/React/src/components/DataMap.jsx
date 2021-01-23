import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import Datamap from 'datamaps/dist/datamaps.all.min.js';

export default class DataMap extends React.Component {
      state = {
        dataset: {},
      }

      render() {
          return (
            <div id="datamap-container" style={{marginTop: ""}}></div>
          );
        }

      renderMap(){
        return new Datamap({
          element: ReactDOM.findDOMNode(this),
          scope: 'usa',
          fills: { defaultFill: '#F5F5F5' },
          geographyConfig: {
            borderColor: '#DEDEDE',
            highlightBorderWidth: 2,
            // don't change color on mouse hover
            highlightFillColor: function(geo) {
                return geo['fillColor'] || '#F5F5F5';
            },
            // only change border
            highlightBorderColor: '#B7B7B7',
            popupTemplate: function(geo, data) {
              return ['<div class="hoverinfo"><strong>',
                      'Hospital Capacity Filled in ' + geo.properties.name,
                      ': ' + data.numberOfThings + '%',
                      '</strong></div>'].join('');
            },
            done: function(datamap) {
              datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                  alert(geography.properties.name);
              });
            },
          },
          responsive: true
        });
      }
      currentScreenWidth(){
        return window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
            
      }
      initialColor(){

        var series = [
          ["AL",75],["AK",43],["AS",50],["AZ",88],["AR",21],["CA",43],
          ["CO",21],["CT",19],["DE",60],["DC",4],["FL",44],["GA",38],
          ["HI",67],["ID",2],["IL",95],["IN",60],["IA",57],["KS",53],
          ["KY",59],["LA",24],["ME",4],["MD",21],["MA",42],["MI",65],
          ["MN",14],["MS",47],["MO",15],["MT",19],["NE",63],["NV",56],
          ["NJ",57],["NM",93],["NH",35], ["NY",39],["NC",71],["ND",16],["OH",8],
          ["OK",25],["OR",81],["PA",21],["RI",95],["SC",33],["SD",93],
          ["TN",15],["TX",52],["UT",19],["VT",69],["VA",37],["VI",44],
          ["WA",13],["WV",21],["WI",89],["WY",20]];

        var dataset = {};
        var onlyValues = series.map(function(obj){ return obj[1]; });

        // We need to colorize every country based on "numberOfWhatever"
        // colors should be uniq for every value.
        // For this purpose we create palette(using min/max series-value)
        var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);
        
        
        // create color palette function
        // color can be whatever you wish
        var paletteScale = d3.scaleLinear()
              .domain([minValue,maxValue])
              .range(["#72ed85","#f25060"]); // green-red color range

        series.forEach(function(item){ //
          // item example value ["USA", 70]
          var iso = item[0],
              value = item[1];
          dataset[iso] = { numberOfThings: value, fillColor: paletteScale(value) };
        });

        this.dataset = dataset

        return dataset

      }
      componentDidMount(){
        const mapContainer = d3.select('#datamap-container');
        const initialScreenWidth = this.currentScreenWidth();
        const containerWidth = (initialScreenWidth < 600) ?
          { width: initialScreenWidth + 'px',  height: (initialScreenWidth * 0.5625) + 'px' } :
          { width: '600px', height: '350px' }
    
        mapContainer.style(containerWidth);
        this.datamap = this.renderMap();
        this.datamap.resize();
        this.datamap.updateChoropleth(this.initialColor());
        this.datamap.labels();
        window.addEventListener('resize', () => {
          const currentScreenWidth = this.currentScreenWidth();
          const mapContainerWidth = mapContainer.style('width');
          if (this.currentScreenWidth() > 600 && mapContainerWidth !== '600px') {
            d3.select('svg').remove();
            mapContainer.style({
              width: '600px',
              height: '350px'
            });
            this.datamap = this.renderMap();
            this.datamap.resize();
            this.datamap.updateChoropleth(this.initialColor());
            this.datamap.labels();
          }
          else if (this.currentScreenWidth() <= 600) {
            d3.select('svg').remove();
            mapContainer.style({
              width: currentScreenWidth + 'px',
              height: (currentScreenWidth * 0.5625) + 'px'
            });
            this.datamap = this.renderMap();
            this.datamap.resize();
            this.datamap.updateChoropleth(this.initialColor());
            this.datamap.labels();
          }
        });
      }
}