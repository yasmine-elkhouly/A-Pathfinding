import React from "react"; 
import { useEffect } from "react";
import { useState } from "react";
import Node from "./Node";
import "./Pathfind.css"; 
import Astar from "../algorithm/astar";

const cols = 10;
const rows = 10;

const NODE_START_ROW = 0;
const NODE_START_COL = 0;
const NODE_END_ROW = rows -1;
const NODE_END_COL = cols -1;

const Pathfind = () => {
    const [Grid, setGrid] = useState([]);
    const [Path, setPath] = useState([]);
    const [visitedNodes, setVisitedNodes] = useState([]);

    useEffect(() => {
        initializeGrid();
    }, []);

    const initializeGrid = () => {
        const grid = new Array(rows);
        
        for(let i = 0; i < rows; i++){
            grid[i] = new Array(cols);
        }

        createSpot(grid);
        addNeighbours(grid);
        setGrid(grid);
        console.log(grid);
        const startNode = grid[NODE_START_ROW][NODE_START_COL];
        const endNode = grid[NODE_END_ROW][NODE_END_COL];
        let path = Astar(startNode, endNode);
        setPath(path.path);
        setVisitedNodes(path.visitedNodes);
    };

    const createSpot = (grid) => {
        for (let i = 0; i < rows; i++){
            for(let j = 0; j < cols; j++){
                grid[i][j] = new Spot(i,j);
            }
        }
    };

    const addNeighbours = (grid) => {
        for (let i = 0; i < rows; i++){
            for (let j = 0; j < cols; j++){
                grid[i][j].addneighbours(grid);
            }
        }
    };

    function Spot(i, j){
        this.x = i;
        this.y = j;
        this.g = 0;
        this.f = 0;
        this.h = 0;
        this.isWall = false;
        if(Math.random(1) < 0.2 && (i!==NODE_START_ROW||j!==NODE_START_COL) && (i!==NODE_END_ROW||j!==NODE_END_COL)){
            this.isWall = true;
        }
        this.isStart = this.x === NODE_START_ROW && this.y === NODE_START_COL;
        this.isEnd = this.x === NODE_END_ROW && this.y === NODE_END_COL;
        this.neighbours = [];
        this.previous = undefined;
        this.addneighbours = function(grid){
            let i = this.x;
            let j = this.y;
            if (i>0) this.neighbours.push(grid[i-1][j]);
            if (i < rows-1) this.neighbours.push(grid[i+1][j]);
            if (j > 0) this.neighbours.push(grid[i][j-1]);
            if (j < cols-1) this.neighbours.push(grid[i][j+1]);
        };
    }

    const gridwidthNode = (
        <div>
            {Grid.map((row, rowIndex) => {
                return(
                    <div key={rowIndex} className="rowWrapper">
                        {row.map((col, colIndex) => {
                            const {isStart, isEnd, isWall} = col;
                            return <Node 
                            key={colIndex} 
                            isStart={isStart} 
                            isEnd={isEnd} 
                            row={rowIndex} 
                            col={colIndex} 
                            isWall={isWall}
                            />;
                        })}
                    </div>
                );
            })}
        </div>
    );

    const visualizePath = () => {
        for(let i = 0; i <= visitedNodes.length; i++){
            if (i === visitedNodes.length){
                setTimeout(() => {
                visualizeShortestPath(Path);
                }, 20*i);
            }
            else{
                setTimeout(() => {
                const node = visitedNodes[i];
                document.getElementById(`node-${node.x}-${node.y}`).className = "node node-visited";
            }, 20*i); 
            }
        }
    }

    const visualizeShortestPath = (shortestPathNodes) => {
        for(let i = 0; i < shortestPathNodes.length; i++){
            setTimeout(() => {
                const node = shortestPathNodes[i];
                document.getElementById(`node-${node.x}-${node.y}`).className = "node node-shortest-path";
            }, 10*i);
        }
    }


    return(
        <div className="Wrapper">
            <button onClick={visualizePath} className="button-56">Find A* Path</button>
            <h1></h1>
            {gridwidthNode}
        </div>
    );
};

export default Pathfind;