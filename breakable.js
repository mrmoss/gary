function breakable_t(x,y,spr)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.spr=spr;
	this.broken=false;
	this.animation_speed=12;
	this.physics=new physics_t(this);
	this.will_break=false;
}

breakable_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation||!this.spr)
		return;

	this.width=this.spr.width-18;
	this.height=this.spr.height;

	if(this.broken)
	{
		this.spr.frame+=this.animation_speed*dt;
		if(this.spr.frame>=this.spr.frame_count-1)
			this.spr.frame=this.spr.frame_count-1;
		if(this.spr.frame<0)
			this.spr.frame=0;
	}

	this.physics.loop(simulation,dt,level);

	console.log(this.physics.y_velocity);
	if(this.physics.y_velocity>5)
		this.will_break=true;

	if(!this.physics.is_falling()&&this.will_break)
		this.shatter();
}

breakable_t.prototype.draw=function(simulation)
{
	if(!simulation||!this.spr)
		return;

	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);
	this.spr.draw(simulation);
	simulation.ctx.restore();
}

breakable_t.prototype.shatter=function()
{
	this.broken=true;
}