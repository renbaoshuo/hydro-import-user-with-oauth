import { definePlugin } from 'hydrooj';

const parseOauthBindings = (data: any) => {
    const result: { platform: string, id: string }[] = [];
    const push = (platform: any, id: any) => {
        if (!platform || !id) return;
        result.push({ platform: String(platform), id: String(id) });
    };

    const oauth = data?.oauth;
    if (Array.isArray(oauth)) {
        for (const item of oauth) push(item?.platform, item?.id);
    } else if (oauth && typeof oauth === 'object') {
        if ('platform' in oauth && 'id' in oauth) {
            push((oauth as any).platform, (oauth as any).id);
        } else {
            for (const platform of Object.keys(oauth)) {
                push(platform, (oauth as any)[platform]);
            }
        }
    }

    return result;
};

export default definePlugin({
    apply(ctx) {
        ctx.inject(['oauth'], ({ oauth }) => {
            ctx.on('user/import/create', async (uid, udoc) => {
                const binds = parseOauthBindings(udoc);
                await Promise.all(binds.map(async (bind) => {
                    const existing = await oauth.get(bind.platform, bind.id);
                    if (existing && existing !== uid) return;
                    if (existing !== uid) await oauth.set(bind.platform, bind.id, uid);
                }));
            });
        });
    },
});
