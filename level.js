function level_t(simulation)
{
	var canvas_width=simulation.canvas.width;
	var canvas_height=simulation.canvas.height;

	simulation.clear_color='#5e5e5e';

	this.monsters=[];
	this.breakables=[];
	this.crates=[];
	this.hovers=[];
	this.bullets=[];

	var crate_size=16;
	var crate_start_x=0;
	var crate_start_y=canvas_height;

	this.monsters.push(new gary_t(50,crate_start_y-crate_size*6));
	this.monsters.push(new ribeye_t(50,crate_start_y-crate_size*6));

	this.breakables.push(new breakable_t(canvas_width/2-crate_size*4,crate_start_y-crate_size*5,new sprite_t('urn.png',4,true)));
	this.breakables.push(new breakable_t(canvas_width/2+crate_size*2,0,new sprite_t('urn.png',4,true)));
	this.breakables.push(new breakable_t(canvas_width/2+crate_size*6,crate_start_y-crate_size,new sprite_t('urn.png',4,true)));

	this.player=new player_t(canvas_width/2+crate_size*2,0);

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
}

level_t.prototype.loop=function(simulation,dt)
{
	for(var ii=0;ii<this.monsters.length;++ii)
		this.monsters[ii].loop(simulation,dt,this);
	for(var ii=0;ii<this.bullets.length;++ii)
		this.bullets[ii].loop(simulation,dt,this);
	this.player.loop(simulation,dt,this);
	for(var ii=0;ii<this.crates.length;++ii)
		this.crates[ii].loop(simulation,dt,this);
	for(var ii=0;ii<this.breakables.length;++ii)
		this.breakables[ii].loop(simulation,dt,this);
	for(var ii=0;ii<this.hovers.length;++ii)
		this.hovers[ii].loop(simulation,dt,this);


	var new_bullets=[];
	var max_bullet_dist=1000;
	for(var ii=0;ii<this.bullets.length;++ii)
		if(this.bullets[ii].moved_dist<max_bullet_dist&&!this.bullets[ii].destroy)
			new_bullets.push(this.bullets[ii]);
	this.bullets=new_bullets;
}

level_t.prototype.draw=function(simulation)
{
	for(var ii=0;ii<this.monsters.length;++ii)
		this.monsters[ii].draw(simulation);
	for(var ii=0;ii<this.bullets.length;++ii)
		if(!this.bullets[ii].exploded)
			this.bullets[ii].draw(simulation);
	this.player.draw(simulation);
	for(var ii=0;ii<this.crates.length;++ii)
		this.crates[ii].draw(simulation);
	for(var ii=0;ii<this.breakables.length;++ii)
		this.breakables[ii].draw(simulation);
	for(var ii=0;ii<this.hovers.length;++ii)
		this.hovers[ii].draw(simulation);
	for(var ii=0;ii<this.bullets.length;++ii)
		if(this.bullets[ii].exploded)
			this.bullets[ii].draw(simulation);
}
