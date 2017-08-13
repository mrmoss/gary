function level_t(simulation)
{
	var canvas_width=simulation.canvas.width;
	var canvas_height=simulation.canvas.height;

	this.player=new player_t(canvas_width/2,0);
	this.crates=[];
	this.hovers=[];
	this.garys=[];

	var crate_size=16;
	var crate_start_x=0;
	var crate_start_y=canvas_height;
	for(var ii=0;ii<320/crate_size;++ii)
	{
		this.crates.push(new crate_t(crate_start_x+crate_size*ii,crate_start_y));
		if(ii==0||ii+1>=320/crate_size)
			this.crates.push(new crate_t(crate_start_x+crate_size*ii,crate_start_y-crate_size));
	}

	this.hovers.push(new hover_t(320/2,200));

	this.garys.push(new gary_t(0,10));
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
	for(var ii=0;ii<this.crates.length;++ii)
		this.crates[ii].draw(simulation);
	for(var ii=0;ii<this.hovers.length;++ii)
		this.hovers[ii].draw(simulation);
	for(var ii=0;ii<this.garys.length;++ii)
		this.garys[ii].draw(simulation);
	this.player.draw(simulation);
}