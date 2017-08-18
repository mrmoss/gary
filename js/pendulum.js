function pendulum_t(inc,max)
{
	this.inc=inc;
	this.max=max;
	this.val=0;
}

pendulum_t.prototype.loop=function(simulation,dt,level,scaler)
{
	if(!scaler)
		scaler=1;

	this.val+=this.inc*scaler*dt;

	if(this.val>Math.abs(this.max))
	{
		this.val=Math.abs(this.max);
		this.inc=-Math.abs(this.inc);
	}
	if(this.val<-Math.abs(this.max))
	{
		this.val=-Math.abs(this.max);
		this.inc=Math.abs(this.inc);
	}
}