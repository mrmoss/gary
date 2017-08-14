function level_t(simulation)
{
	var canvas_width=simulation.canvas.width;
	var canvas_height=simulation.canvas.height;

	simulation.clear_color='#5e5e5e';

	this.crates=[];
	this.hovers=[];
	this.garys=[];

	var crate_size=16;
	var crate_start_x=0;
	var crate_start_y=canvas_height;
	for(var ii=0;ii<320/crate_size;++ii)
	{
		this.crates.push(new crate_t(crate_start_x+crate_size*ii,crate_start_y));
		if(ii+1>=320/crate_size)
			this.crates.push(new crate_t(crate_start_x+crate_size*ii,crate_start_y-crate_size));
	}

	for(var yy=0;yy<5;++yy)
		for(var xx=0;xx<7;++xx)
			this.crates.push(new crate_t(crate_start_x+crate_size*xx,crate_start_y-crate_size*(1+yy)));

	this.hovers.push(new hover_t(canvas_width/2+crate_size*2,crate_start_y-crate_size*3.5));

	this.player=new player_t(canvas_width/2+crate_size*2,0);
	this.garys.push(new gary_t(93,crate_start_y-crate_size*6));
}

level_t.prototype.loop=function(simulation,dt)
{
	for(var ii=0;ii<this.crates.length;++ii)
		this.crates[ii].loop(simulation,dt,this);
	for(var ii=0;ii<this.hovers.length;++ii)
		this.hovers[ii].loop(simulation,dt,this);
	for(var ii=0;ii<this.garys.length;++ii)
		this.garys[ii].loop(simulation,dt,this);
	this.player.loop(simulation,dt,this);
}

level_t.prototype.draw=function(simulation)
{
	this.player.draw(simulation);
	for(var ii=0;ii<this.crates.length;++ii)
		this.crates[ii].draw(simulation);
	for(var ii=0;ii<this.hovers.length;++ii)
		this.hovers[ii].draw(simulation);
	for(var ii=0;ii<this.garys.length;++ii)
		this.garys[ii].draw(simulation);
}