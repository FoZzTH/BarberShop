export function logger(ctx, next) {
  console.log(ctx.message.text);

  return next();
}
