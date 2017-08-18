function tile_maker_t(source,width,height)
{
	this.image=new Image();
	this.image.src=source;
	this.width=width;
	this.height=height;
	this.shown=true;

	this.tiles=null;
	this.chosen_tile=-1;

	this.under_mouse_x=0;
	this.under_mouse_y=0;
}

tile_maker_t.prototype.tile_to_xy_pos=function(tile_x,tile_y)
{
	return {x:tile_x*this.width,y:tile_y*this.height};
}

tile_maker_t.prototype.get_tile_xy=function(tile_num)
{
	if(!this.image.width||!this.image.height)
		return {x:0,y:0};

	var tiles_per_y=this.get_tile_maker_wh().w;
	return {x:Math.floor(tile_num%tiles_per_y),y:Math.floor(tile_num/tiles_per_y)};
}

tile_maker_t.prototype.get_tile_maker_wh=function()
{
	if(!this.image.width||!this.image.height)
		return {w:1,h:1};
	return {w:Math.floor(this.image.width/this.width),h:Math.floor(this.image.height/this.height)};
}

tile_maker_t.prototype.loop=function(simulation,dt,level)
{
	if(!this.tiles&&this.image.width&&this.image.height)
	{
		this.tiles=[];
		for(var yy=0;yy<Math.floor(simulation.canvas.height/this.height);++yy)
		{
			this.tiles.push([]);
			for(var xx=0;xx<Math.floor(simulation.canvas.width/this.width);++xx)
				this.tiles[yy].push([-1,null]);
		}
	}

	if(!this.tiles)
		return;

	this.shown=simulation.keys_down[kb_control];

	this.under_mouse_x=Math.floor(simulation.mouse_x/this.width);
	this.under_mouse_y=Math.floor(simulation.mouse_y/this.height);

	var tiles_per_y=this.get_tile_maker_wh().w;

	if(simulation.mouse_down[mb_left])
	{
		if(this.shown)
		{
			var xx=this.under_mouse_x;
			if(xx>=tiles_per_y)
				xx=this.width*this.height+1;
			this.chosen_tile=this.under_mouse_y*tiles_per_y+xx;
			if(this.chosen_tile<0||this.chosen_tile>=this.width*this.height)
				this.chosen_tile=-1;
		}
		else
		{
			var obj=this.tiles[this.under_mouse_y][this.under_mouse_x][1];

			if(obj&&this.chosen_tile<0)
			{
				var new_blocks=[];
				for(var ii=0;ii<level.blocks.length;++ii)
					if(!(level.blocks[ii]===obj))
						new_blocks.push(level.blocks[ii]);
				level.blocks=new_blocks;
				this.tiles[this.under_mouse_y][this.under_mouse_x][1]=null;
			}
			if(!obj&&this.chosen_tile>=0)
			{
				var pos=this.tile_to_xy_pos(this.under_mouse_x,this.under_mouse_y+1);
				var obj=new block_t(pos.x,pos.y,this.width,this.height);
				this.tiles[this.under_mouse_y][this.under_mouse_x][1]=obj;
				level.blocks.push(obj);
			}
			this.tiles[this.under_mouse_y][this.under_mouse_x][0]=this.chosen_tile;
		}
	}
}

tile_maker_t.prototype.draw=function(simulation)
{
	if(!this.tiles)
		return;

	for(var yy=0;yy<Math.floor(simulation.canvas.height/this.height);++yy)
	{
		for(var xx=0;xx<Math.floor(simulation.canvas.width/this.width);++xx)
		{
			var tile=this.tiles[yy][xx][0];
			if(tile<0||tile>=this.width*this.height)
				continue;

			var tile_pos=this.get_tile_xy(tile);

			simulation.ctx.drawImage(this.image,
				tile_pos.x*this.width,
				tile_pos.y*this.height,
				this.width,
				this.height,
				xx*this.width,
				yy*this.width,
				this.width,
				this.height);
		}
	}

	var chosen_tile_pos=this.get_tile_xy(this.chosen_tile);

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

		var line_width=2;
		simulation.ctx.lineWidth=line_width;
		simulation.ctx.strokeStyle='#ffffff';
		simulation.ctx.beginPath();
		simulation.ctx.rect(line_width/2.0,line_width/2.0,this.image.width-line_width,this.image.height-line_width);
		simulation.ctx.stroke();

		var tile_maker_size=this.get_tile_maker_wh();

		if(chosen_tile_pos.x<tile_maker_size.w&&chosen_tile_pos.y<tile_maker_size.h)
		{
			simulation.ctx.beginPath();
			simulation.ctx.rect(line_width/2.0+chosen_tile_pos.x*this.width,line_width/2.0+chosen_tile_pos.y*this.height,this.width-line_width,this.height-line_width);
			simulation.ctx.stroke();
		}
	}
	else if(this.chosen_tile>=0)
	{
		simulation.ctx.drawImage(this.image,
			chosen_tile_pos.x*this.width,
			chosen_tile_pos.y*this.height,
			this.width,
			this.height,
			this.under_mouse_x*this.width,
			this.under_mouse_y*this.width,
			this.width,
			this.height);
	}
}