function gary_t(x,y)
{
	this.x=x;
	this.y=y;
	this.width=0;
	this.height=0;
	this.spr=new sprite_t('gary.png',2);
	this.spr_eye=new sprite_t('eye.png',1);
	this.spr_tenticle=new sprite_t('tenticle.png',1);
	this.direction=1;

	this.eyes=[new gary_eye(this),new gary_eye(this)];
	this.eyes[0].xoff=-3;
	this.eyes[0].yoff=-35;
	this.eyes[0].max_dist=2;
	this.eyes[1].xoff=0;
	this.eyes[1].yoff=-16.5;
	this.eyes[1].max_dist=2.5;
};

gary_t.prototype.loop=function(simulation,dt,level)
{
	if(!simulation)
		return;

	this.width=22;
	this.height=this.spr.height;

	for(var ii=0;ii<this.eyes.length;++ii)
		this.eyes[ii].loop(simulation,dt,level);
};

gary_t.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	var spr_width=this.spr.width*this.spr.x_scale;

	simulation.ctx.save();
	simulation.ctx.translate(this.x-spr_width/2.0,this.y);
	this.spr.frame=1;
	this.spr.draw(simulation);
	simulation.ctx.restore();

	for(var ii=0;ii<this.eyes.length;++ii)
		this.eyes[ii].draw(simulation);

	simulation.ctx.save();
	simulation.ctx.translate(this.x-spr_width/2.0,this.y);
	this.spr.frame=0;
	this.spr.draw(simulation);
	simulation.ctx.restore();
};

function gary_eye(gary)
{
	this.gary=gary;
	this.xoff=0;
	this.yoff=0;
	this.max_dist=0;
	this.xlook=0;
	this.ylook=0;
}

gary_eye.prototype.calculate_dists=function()
{
	var dists={};
	dists.gary_width=this.gary.spr.width*this.gary.spr.x_scale;
	dists.x=this.gary.x+this.xoff;
	dists.y=this.gary.y+this.yoff;
	dists.spr_width=this.gary.spr_eye.width*this.gary.spr_eye.x_scale;
	dists.spr_height=this.gary.spr_eye.height*this.gary.spr_eye.y_scale;
	return dists;
}

gary_eye.prototype.loop=function(simulation,dt,level)
{
	var dists=this.calculate_dists();

	var direction=point_direction(dists.x,dists.y,level.player.x,level.player.y);

	var dist=Math.min(this.max_dist,point_distance(dists.x,dists.y,level.player.x,level.player.y)/50.0);

	this.xlook=dist*Math.cos(direction);
	this.ylook=dist*Math.sin(direction);
}

gary_eye.prototype.draw=function(simulation)
{
	if(!simulation)
		return;

	var dists=this.calculate_dists();

	simulation.ctx.save();
	simulation.ctx.translate(dists.x+this.xlook-dists.spr_width/2.0,dists.y+this.ylook-dists.spr_height/2.0);
	this.gary.spr_eye.draw(simulation);
	simulation.ctx.restore();
}