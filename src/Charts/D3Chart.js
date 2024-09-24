import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

const D3Chart = () => {
  const chartRef = useRef();  // Always called in every render

  const width = 450;
  const height = 450;
  const margin = 40;
  const radius = Math.min(width, height) / 2 - margin;

  useEffect(() => {
    const fetchDataAndRenderChart = async () => {
      try {
        const response = await axios.get('http://localhost:3000/budget');
        const fetchedData = response.data.myBudget;
        const formattedData = fetchedData.map(item => ({
          key: item.title,
          value: item.budget,
          color: item.color,
        }));

        // Now, render the chart after data is set
        renderChart(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const renderChart = (data) => {
      // Clear previous chart before rendering new one
      d3.select(chartRef.current).selectAll('*').remove();

      const svg = d3.select(chartRef.current)
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2}, ${height / 2})`);

      const color = d3.scaleOrdinal()
        .domain(data.map(d => d.key))
        .range(data.map(d => d.color));

      const pie = d3.pie()
        .sort(null)
        .value(d => d.value);

      const arc = d3.arc()
        .innerRadius(radius * 0.5)  // Donut hole size
        .outerRadius(radius * 0.8);

      const outerArc = d3.arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

      const pieData = pie(data);

      // Add slices
      svg.selectAll('allSlices')
        .data(pieData)
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.key))
        .attr('stroke', 'white')
        .style('stroke-width', '2px')
        .style('opacity', 0.7);

      // Add polylines between slices and labels
      svg.selectAll('allPolylines')
        .data(pieData)
        .enter()
        .append('polyline')
        .attr('stroke', 'black')
        .style('fill', 'none')
        .attr('stroke-width', 1)
        .attr('points', d => {
          const posA = arc.centroid(d);
          const posB = outerArc.centroid(d);
          const posC = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          posC[0] = radius * 0.95 * (midAngle < Math.PI ? 1 : -1);
          return [posA, posB, posC];
        });

      // Add labels for category names
      svg.selectAll('allLabels')
        .data(pieData)
        .enter()
        .append('text')
        .text(d => d.data.key)
        .attr('transform', d => {
          const pos = outerArc.centroid(d);
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          pos[0] = radius * 0.99 * (midAngle < Math.PI ? 1 : -1);
          return `translate(${pos})`;
        })
        .style('text-anchor', d => {
          const midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
          return (midAngle < Math.PI ? 'start' : 'end');
        });

      // Add numerical value labels inside the pie slices
      svg.selectAll('allValues')
        .data(pieData)
        .enter()
        .append('text')
        .text(d => d.data.value)
        .attr('transform', d => {
          const pos = arc.centroid(d);
          return `translate(${pos})`;
        })
        .style('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', 'white');
    };

    fetchDataAndRenderChart();
  }, [radius]);  // Include radius as a dependency

  return (
    <div id="chart-container">
      <h2>Budget D3JS Donut Chart</h2>
      <svg ref={chartRef}></svg>
    </div>
  );
};

export default D3Chart;
