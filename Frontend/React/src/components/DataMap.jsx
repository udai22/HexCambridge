import React from 'react';
import ReactDOM from 'react-dom';
import * as d3 from 'd3';
import Datamap from 'datamaps/dist/datamaps.all.min.js';

export default class DataMap extends React.Component {
      render() {
          return (
            <div id="datamap-container" style={{marginTop: "3em"}}></div>
          );
        }
      renderMap(){
        return new Datamap({
          element: ReactDOM.findDOMNode(this),
          scope: 'usa',
          geographyConfig: {
            borderWidth: 0.5,
            highlightFillColor: '#FFCC80',
          },
          responsive: true
        });
      }
      currentScreenWidth(){
        return window.innerWidth ||
            document.documentElement.clientWidth ||
            document.body.clientWidth;
            
      }
      componentDidMount(){
          const mapContainer = d3.select('#datamap-container');
          const initialScreenWidth = this.currentScreenWidth();
          const containerWidth = (initialScreenWidth < 600) ?
            { width: '1000px',  height: '1000px' } :
            { width: '1000px', height: '1000px' }
      
          mapContainer.style(containerWidth);
          this.datamap = this.renderMap();
          this.datamap.resize();
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
            }
            else if (this.currentScreenWidth() <= 600) {
              d3.select('svg').remove();
              mapContainer.style({
                width: '1000px',
                height: '1000px'
              });
              this.datamap = this.renderMap();
            }
        });
      }
}