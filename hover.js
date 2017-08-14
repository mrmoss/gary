function hover_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.spr=new sprite_t('hover.png',4);
	this.animation_speed=10;
	this.speed=20;
	this.dir=-1;
	this.start_pos=x;
	this.max_dist=128;
	this.move_with=null;
}

hover_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=this.spr.width;
	this.height=this.spr.height;
	this.spr.frame+=this.animation_speed*dt;

	this.x+=this.speed*this.dir*dt;
	if(this.move_with)
		this.move_with.x+=this.speed*this.dir*dt;

	if(this.x>this.start_pos+this.max_dist/2)
		this.dir=-1;
	if(this.x<this.start_pos-this.max_dist/2)
		this.dir=1;
}

hover_t.prototype.draw=function(simulation)
{
	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);
	this.spr.draw(simulation);
	simulation.ctx.restore();
}