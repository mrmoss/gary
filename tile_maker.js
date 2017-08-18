function tile_maker_t(source,width,height)
{
	this.image=new Image();
	this.image.src=source;
	this.width=width;
	this.height=height;
	this.shown=true;

	this.tiles=[];
	this.tiles_per_y=0;
	this.chosen_tile=-1;
}

tile_maker_t.prototype.setup=function(simulation)
{
	this.tiles_per_y=Math.floor(this.image.width/this.width);

	for(var yy=0;yy<Math.floor(simulation.canvas.height/this.height);++yy)
	{
		this.tiles.push([]);
		for(var xx=0;xx<Math.floor(simulation.canvas.width/this.width);++xx)
			this.tiles[yy].push(-1);
	}
}

tile_maker_t.prototype.loop=function(simulation,dt)
{
	this.shown=simulation.keys_down[kb_control];

	if(simulation.mouse_down[mb_left])
	{
		var xx=Math.floor(simulation.mouse_x/this.width);
		var yy=Math.floor(simulation.mouse_y/this.height);
		if(this.shown)
		{
			if(xx>=this.tiles_per_y)
				xx=this.width*this.height+1;
			this.chosen_tile=yy*this.tiles_per_y+xx;
			if(this.chosen_tile<0||this.chosen_tile>=this.width*this.height)
				this.chosen_tile=-1;
		}
		else
		{
			this.tiles[yy][xx]=this.chosen_tile;
		}
	}
}

tile_maker_t.prototype.draw=function(simulation)
{
	for(var yy=0;yy<Math.floor(simulation.canvas.height/this.height);++yy)
	{
		for(var xx=0;xx<Math.floor(simulation.canvas.width/this.width);++xx)
		{
			var tile=this.tiles[yy][xx];
			if(tile<0||tile>=this.width*this.height)
				continue;

			var tile_x=Math.floor(tile%this.tiles_per_y);
			var tile_y=Math.floor(tile/this.tiles_per_y);

			simulation.ctx.drawImage(this.image,
				tile_x*this.width,
				tile_y*this.height,
				this.width,
				this.height,
				xx*this.width,
				yy*this.width,
				this.width,
				this.height);
		}
	}

	if(this.shown)
	{
		simulation.ctx.drawImage(this.image,
			0,
			0,
			this.image.width,
			this.image.height,
			0,
			0,
			this.image.width,
			this.image.height);

		var tile_x=Math.floor(this.chosen_tile%this.tiles_per_y);
		var tile_y=Math.floor(this.chosen_tile/this.tiles_per_y);

		simulation.ctx.save();
		simulation.ctx.lineWidth=2;
		simulation.ctx.strokeStyle='#ffffff';
		simulation.ctx.beginPath();
		simulation.ctx.rect(1,1,this.image.width-simulation.ctx.lineWidth,this.image.height-simulation.ctx.lineWidth);
		simulation.ctx.stroke();
		simulation.ctx.beginPath();
		simulation.ctx.rect(tile_x*this.width+1,tile_y*this.height+1,this.width-simulation.ctx.lineWidth,this.height-simulation.ctx.lineWidth);
		simulation.ctx.stroke();
		simulation.ctx.restore();
	}
}