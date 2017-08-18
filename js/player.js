function player_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.dir=1;
	this.spr_idle=new sprite_t('img/player_idle.png',1,true);
	this.spr_move=new sprite_t('img/player_move.png',4,true);
	this.spr_jump=new sprite_t('img/player_jump.png',1,true);
	this.spr=this.spr_idle;
	this.speed=100;
	this.animation_speed=8;

	this.physics=new physics_t(this);
};

player_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=10;
	this.height=this.spr_move.height;

	this.physics.loop(simulation,dt,level);

	if(simulation.keys_down[kb_right]&&!simulation.keys_down[kb_left])
	{
		this.dir=1;
		this.physics.set_new_x(this.speed*dt);
	}
	if(!simulation.keys_down[kb_right]&&simulation.keys_down[kb_left])
	{
		this.dir=-1;
		this.physics.set_new_x(-this.speed*dt);
	}

	if(simulation.keys_pressed[kb_up])
		this.physics.set_jump();
	if(this.physics.is_falling())
	{
		this.spr=this.spr_jump;
		this.spr.x_scale=this.dir;
	}
	else
	{
		if(this.physics.moved)
		{
			this.spr=this.spr_move;
			this.spr.frame+=this.animation_speed*dt;
		}
		else
		{
			this.spr=this.spr_idle;
		}

		this.spr.x_scale=this.dir;
	}

	if(simulation.keys_pressed[kb_space])
	{
		var yoff=-10;
		if(this.physics.is_falling())
			yoff=-16;
		var bullet=new bullet_t(this.x+8*this.dir,this.y+yoff);
		bullet.dir=this.dir;
		level.bullets.push(bullet);
	}
};

player_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	if(!this.spr_idle.height||!this.spr_move.height||!this.spr_jump.height)
	{
		simulation.ctx.save();
		simulation.ctx.translate(-100000,-100000);
		this.spr_idle.draw(simulation);
		this.spr_move.draw(simulation);
		this.spr_jump.draw(simulation);
		simulation.ctx.restore();
	}

	var yoff=0;
	if(this.physics.is_falling())
		yoff=(this.spr_jump.height-this.spr_idle.height)/2;

	simulation.ctx.save();
	simulation.ctx.translate(this.x,this.y+yoff);
	this.spr.draw(simulation);
	simulation.ctx.restore();
};