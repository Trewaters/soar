export async function POST(req){
    const {introPose, focusPose, outroPose} = await req.json();
    console.log(introPose, focusPose, outroPose);

    return NextResponse.json({msg: 'ok'});
}