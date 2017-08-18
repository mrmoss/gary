function tile_maker_t(source,width,height)
{
	this.image=new Image();
	this.image.src=source;
	this.width=width;
	this.height=height;
	this.shown=true;

	this.tiles=null;
	this.place_tpos=null;

	this.mouse_pos={x:0,y:0};
	this.load_str='';
}

tile_maker_t.prototype.tile_tpos_to_xypos=function(tile_x,tile_y)
{
	return {x:tile_x*this.width,y:(tile_y+1)*this.height};
}

tile_maker_t.prototype.get_tile_maker_wh=function()
{
	if(!this.image.width||!this.image.height)
		return {w:1,h:1};
	return {w:Math.floor(this.image.width/this.width),h:Math.floor(this.image.height/this.height)};
}

tile_maker_t.prototype.load=function(load_str)
{
	this.load_str=load_str;
}

tile_maker_t.prototype.load_from_str=function(load_str)
{
	var obj=JSON.parse(load_str);
	for(var yy=0;yy<obj.length;++yy)
		for(var xx=0;xx<obj[yy].length;++xx)
			this.place_tile(obj[yy][xx].tpos,obj[yy][xx].gpos);
}

tile_maker_t.prototype.save_to_str=function()
{
	var save_str='[';
	for(var yy=0;yy<Math.floor(simulation.canvas.height/this.height);++yy)
	{
		save_str+='[';
		for(var xx=0;xx<Math.floor(simulation.canvas.width/this.width);++xx)
		{
			save_str+='{"tpos":{"x":'+this.tiles[yy][xx].tx+',"y":'+this.tiles[yy][xx].ty+'},"gpos":{"x":'+xx+',"y":'+yy+'}}';
			if(xx+1<Math.floor(simulation.canvas.width/this.width))
				save_str+=',';
		}
		save_str+=']';
		if(yy+1<Math.floor(simulation.canvas.height/this.height))
			save_str+=',';
	}
	save_str+=']';
	return save_str;
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
				this.tiles[yy].push(new tile_t(-1,-1,null));
		}

		if(this.load_str)
		{
			this.load_from_str(this.load_str);
			this.load_str='';
		}
	}

	if(!this.tiles)
		return;

	this.shown=simulation.keys_down[kb_control];

	if(this.shown&&simulation.keys_pressed[kb_s])
		console.log(this.save_to_str());

	this.mouse_pos={x:Math.floor(simulation.mouse_x/this.width),y:Math.floor(simulation.mouse_y/this.height)};

	var tile_maker_size=this.get_tile_maker_wh();
	var tiles_per_y=tile_maker_size.w;

	if(simulation.mouse_down[mb_left])
	{
		if(this.shown)
		{
			if(this.mouse_pos.x<tile_maker_size.w&&this.mouse_pos.y<tile_maker_size.h)
				this.place_tpos={x:this.mouse_pos.x,y:this.mouse_pos.y};
			else
				this.place_tpos={x:-1,y:-1};
		}
		else if(this.place_tpos)
		{
			this.place_tile(this.place_tpos,this.mouse_pos);
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
			if(this.tiles[yy][xx].visible())
				simulation.ctx.drawImage(this.image,
					this.tiles[yy][xx].tx*this.width,
					this.tiles[yy][xx].ty*this.height,
					this.width,
					this.height,
					xx*this.width,
					yy*this.height,
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

		var line_width=2;
		simulation.ctx.lineWidth=line_width;
		simulation.ctx.strokeStyle='#ffffff';
		simulation.ctx.beginPath();
		simulation.ctx.rect(line_width/2.0,line_width/2.0,this.image.width-line_width,this.image.height-line_width);
		simulation.ctx.stroke();

		var tile_maker_size=this.get_tile_maker_wh();

		if(this.place_tpos)
		{
			simulation.ctx.beginPath();
			simulation.ctx.rect(line_width/2.0+this.place_tpos.x*this.width,line_width/2.0+this.place_tpos.y*this.height,this.width-line_width,this.height-line_width);
			simulation.ctx.stroke();
		}
	}
	else if(this.place_tpos)
	{
		simulation.ctx.drawImage(this.image,
			this.place_tpos.x*this.width,
			this.place_tpos.y*this.height,
			this.width,
			this.height,
			this.mouse_pos.x*this.width,
			this.mouse_pos.y*this.height,
			this.width,
			this.height);
	}
}

//place the tile on the tilesheet coordinates tpos at the grid coordinates gpos
tile_maker_t.prototype.place_tile=function(tpos,gpos)
{
	var tile=this.tiles[gpos.y][gpos.x];
	tile.tx=tpos.x;
	tile.ty=tpos.y;

	//Removed tile, time to remove the block under it
	if(!tile.visible()&&tile.block)
	{
		var new_blocks=[];
		for(var ii=0;ii<level.blocks.length;++ii)
			if(!(level.blocks[ii]===tile.block))
				new_blocks.push(level.blocks[ii]);
		level.blocks=new_blocks;
		tile.block=null;
	}

	//Added a tile with no block under it, add it
	else if(tile.visible()&&!tile.block)
	{
		var pos=this.tile_tpos_to_xypos(gpos.x,gpos.y);
		tile.block=new block_t(pos.x,pos.y,this.width,this.height);
		level.blocks.push(tile.block);
	}
}

function tile_t(tx,ty,block)
{
	this.tx=tx;
	this.ty=ty;
	this.block=block
}

tile_t.prototype.visible=function()
{
	return (this.tx>=0&&this.ty>=0);
}