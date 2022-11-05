import React, { useCallback, useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import './index.scss';

const isMoving = game => {
    return game.posts.some(({ selected }) => (selected));
};
const getSelected = game => {
    return game.posts.find(({selected}) => (selected)).postId;
};
const canMove = (sourcePost, targetPost) => {
    return !targetPost.rings.length || targetPost.rings[0] > sourcePost.rings[0];
};
const isSolved = game => {
    return game.posts[0].rings.length === 0 &&game.posts[1].rings.length === 0;
};

const stepsSolution = [
    'ac', // 1
    'abacbc', // 2
    'acabcbacbabcac', // 3
    'abacbcabcacbabacbcbacabcabacbc', // 4
    'acabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcac', // 5
    'abacbcabcacbabacbcbacabcabacbcabcacbabcabcbacacbabacbcabcacbabacbcbacabcabacbcbacacbabcabcbacabcabacbcabcacbabacbcbacabcabacbc', // 6
    'acabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcacabcbcabacbacabcbcababcacbacbcabacbacabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcacbacbcabacbacabcbcababcacbacbcababcacabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcac', // 7
    'abacbcabcacbabacbcbacabcabacbcabcacbabcabcbacacbabacbcabcacbabacbcbacabcabacbcbacacbabcabcbacabcabacbcabcacbabacbcbacabcabacbcabcacbabcabcbacacbabacbcabcacbabcabcbacabcabacbcbacacbabcabcbacacbabacbcabcacbabacbcbacabcabacbcabcacbabcabcbacacbabacbcabcacbabacbcbacabcabacbcbacacbabcabcbacabcabacbcabcacbabacbcbacabcabacbcbacacbabcabcbacacbabacbcabcacbabcabcbacabcabacbcbacacbabcabcbacabcabacbcabcacbabacbcbacabcabacbcabcacbabcabcbacacbabacbcabcacbabacbcbacabcabacbcbacacbabcabcbacabcabacbcabcacbabacbcbacabcabacbc', // 8
    'acabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcacabcbcabacbacabcbcababcacbacbcabacbacabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcacbacbcabacbacabcbcababcacbacbcababcacabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcacabcbcabacbacabcbcababcacbacbcabacbacabcbacbabcacabcbcabacbacabcbcababcacbacbcababcacabcbacbabcacbacbcabacbacabcbcababcacbacbcabacbacabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcacabcbcabacbacabcbcababcacbacbcabacbacabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcacbacbcabacbacabcbcababcacbacbcababcacabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcacbacbcabacbacabcbcababcacbacbcabacbacabcbacbabcacabcbcabacbacabcbcababcacbacbcababcacabcbacbabcacbacbcabacbacabcbcababcacbacbcababcacabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcacabcbcabacbacabcbcababcacbacbcabacbacabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcacbacbcabacbacabcbcababcacbacbcababcacabcbacbabcacabcbcabacbacabcbacbabcacbacbcababcacabcbacbabcac', // 9
]

export default function App() {
    const ref = useRef(null);
    const indexRef = useRef(0);
    const [steps, setSteps] = useState([]);
    const [solved, setSolved] = useState(false);
    const [game, setGame] = useState({
        posts: [{
            postId: 'a',
            rings: [1,2,3,4,5,6,7,8,9,10],
            selected: false,
        }, {
            postId: 'b',
            rings: [],
            selected: false,
        }, {
            postId: 'c',
            rings: [],
            selected: false,
        }]
    });

    useEffect(() => {
        setSolved(isSolved(game));
    }, [game]);

    useEffect(() => {
        function handleKey(e) {
            let post;
            // console.log(e);
            if (e.code === 'KeyI') {
                post = 'a';
            } else if (e.code === 'KeyO') {
                post = 'b';
            } else if (e.code === 'KeyP') {
                post = 'c';
            }
            if (post) {
                handlePostSelect(post);
                setSteps([...steps, post]);
            }
        }

        document.addEventListener('keypress', handleKey);
        return () => {
            document.removeEventListener('keypress', handleKey);
        }
    }, [handlePostSelect, steps]);

    // useEffect(() => {
    //     console.log(steps.join(''));
    // }, [steps]);

    function handlePostSelect(selectedPostId) {
        if (!game.posts.find(p => p.postId === selectedPostId).rings.length && !isMoving(game)) {
            // debugger;
            // selecting empty post
            return;
        } else if (!isMoving(game)) {
            // first select
            const newGame = {
                ...game,
                posts: game.posts.map(p => ({
                    ...p,
                    selected: p.postId === selectedPostId,
                })),
            };
            // debugger;
            setGame(newGame);
        } else if (isMoving(game) && getSelected(game) === selectedPostId) {
            // cancel (same one selected)
            const newGame = {
                ...game,
                posts: game.posts.map(p => ({
                    ...p,
                    selected: false,
                })),
            };
            setGame(newGame);
        } else if (isMoving(game)) {
            // moving (different one selected)
            const sourcePost = game.posts.find(({selected}) => (selected));
            const targetPost = game.posts.find(p => p.postId === selectedPostId);

            if (canMove(sourcePost, targetPost)) {
                const ringNum = sourcePost.rings[0];
                const newGame = {
                    ...game,
                    posts: game.posts.map(p => ({
                        ...p,
                        rings: p.postId === selectedPostId ? [ringNum, ...p.rings] : p.postId === sourcePost.postId ? game.posts.find(({selected}) => (selected)).rings.slice(1) : p.rings,
                        selected: false,
                    })),
                };
                setGame(newGame);

            } else {
                const newGame = {
                    ...game,
                    posts: game.posts.map(p => ({
                        ...p,
                        selected: false,
                    })),
                };
                setGame(newGame);
            }
        }
    };

    const handleSolve = useCallback(() => {
        console.log('running');
        ref.current = setInterval(() => {
            if (solved) {
                clearInterval(ref.current);
            } else {
                const post = stepsSolution[8][indexRef.current];
                if (post === 'a') {
                    document.dispatchEvent(new KeyboardEvent('keypress',{'code':'KeyI'}));
                } else if (post === 'b') {
                    document.dispatchEvent(new KeyboardEvent('keypress',{'code':'KeyO'}));
                } else if (post === 'c') {
                    document.dispatchEvent(new KeyboardEvent('keypress',{'code':'KeyP'}));
                }

                // console.log({post});
                // handlePostSelect(post);
                indexRef.current++;
            }
        }, 5);
    }, [solved]);


    return (
        <>
            <div className="container d-flex w-100 h-50 mt-4">
                {game.posts.map(({ postId, rings, selected }) => {
                    return <Post key={postId} postId={postId} rings={rings} onSelect={handlePostSelect} selected={selected} />
                })}
            </div>
            <div className="m-4 text-center">
                <button className="btn btn-primary" onClick={handleSolve}>solve{solved ? 'd': ''}</button>
            </div>
            <div className="mt-1 text-center text-wrap steps m-auto">
                {steps}
            </div>
            <br/>
            {/* {stepsSolution.map((s, i) => {
                return <div key={i}>{s.length}</div>
            })} */}
        </>
    );
}
function Post({ postId, rings, onSelect, selected}) {
    return (
        <div className={cx("border border-primary p-2 flex-grow-1 d-flex justify-content-end flex-column align-items-center post", { 'bg-light': selected })} onClick={() => onSelect(postId)}>
            {rings.map((r, i) => {
                return (
                    <div key={i} style={{width: `${r*10+40}px`, background: `#${(10-r)*111}` }} className={cx(`p-2 rounded d-flex align-items-center justify-content-center text-light`, { 'mb-4': selected && i === 0})}>
                        {r}
                    </div>
                )
            })}
            <div className="mt-4 fw-bold">
                {postId}
            </div>
        </div>
    );
}
