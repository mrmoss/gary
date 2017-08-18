function ribeye_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.spr=new sprite_t('img/ribeye.png',2,true);
	this.dir=1;
	this.speed=30;
	this.frenzy=0;

	this.physics=new physics_t(this);

	this.eye=new eye_t(this);
	this.eye.xoff=0;
	this.eye.yoff=-10;
	this.eye.max_dist=2;

	this.pendulum=new pendulum_t(1200,200);
};

ribeye_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=20;
	this.height=this.spr.height;

	this.physics.loop(simulation,dt,level);
	this.eye.loop(simulation,dt,level);

	this.pendulum.loop(simulation,dt,level);

	//Flail tenticles faster if player is close
	this.frenzy=Math.max(0.3,Math.min(1,80/Math.abs(point_distance(this.x,this.y,level.player.x,level.player.y))));

	//Getto animation hack
	this.pendulum.loop(simulation,dt,level,this.frenzy);
	this.spr.x_scale=1.0-this.pendulum.inc/this.pendulum.max*dt/5;
	this.spr.y_scale=1.0+this.pendulum.inc/this.pendulum.max*dt/2.5;

	//Dumb AI
	var buffer=5;
	if(level.player.x<this.x-buffer)
		this.dir=-1;
	else if(level.player.x>this.x+buffer)
		this.dir=1;
	this.physics.set_new_x(this.speed*this.dir*dt);
};

ribeye_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);
	this.spr.frame=1;
	this.spr.draw(simulation);
	simulation.ctx.restore();

	this.eye.draw(simulation);

	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y);
	this.spr.frame=0;
	this.spr.draw(simulation);
	simulation.ctx.restore();
};