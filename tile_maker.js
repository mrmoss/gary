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
	if(simulation.mouse_down[mb_left])
	{
		var xx=Math.floor(simulation.mouse_x/this.width);
		var yy=Math.floor(simulation.mouse_y/this.height);
		if(this.shown)
		{
			this.chosen_tile=yy*this.tiles_per_y+xx;
			if(this.chosen_tile<0||this.chosen_tile>=this.width*this.height)
				this.chosen_tile=-1;
			this.shown=false;
		}
		else
		{
			this.tiles[yy][xx]=this.chosen_tile;
		}
	}

	if(simulation.keys_pressed[kb_space])
		this.shown=!this.shown;
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

			simulation.ctx.save();
			simulation.ctx.translate(xx*this.width,yy*this.width);
			simulation.ctx.drawImage(this.image,
				tile_x*this.width,
				tile_y*this.height,
				this.width,
				this.height,
				0,
				0,
				this.width,
				this.height);
			simulation.ctx.restore();
		}
	}

	if(this.shown)
	{
		simulation.ctx.save();
		simulation.ctx.translate(0,0);
		simulation.ctx.drawImage(this.image,
			0,
			0,
			this.image.width,
			this.image.height,
			0,
			0,
			this.image.width,
			this.image.height);
		simulation.ctx.restore();
	}
}