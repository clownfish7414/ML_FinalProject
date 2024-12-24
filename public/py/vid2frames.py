import cv2
import shutil
from tqdm import tqdm
from pathlib import Path

def V2F(args, user_id) -> None:
    '''
    Convert videos to frames
    :param args: argparse.Namespace, the arguments for the function
    :param user_id: str, the user ID
    :return: None
    '''
    
    root = Path(args.root).joinpath(user_id)
    vids = list(root.glob('*.mp4'))

    # remove the label if it exists
    check = Path(args.save_path).joinpath(user_id).joinpath(args.label_name)
    if check.exists() and args.remove_label:
        check.unlink()
    
    for idx, v in enumerate(tqdm(vids)):
        vid_path = Path(args.save_path).joinpath(user_id).joinpath("vid_" + str(idx))
        # remove the frame if it exists
        if vid_path.exists() and args.remove_frames:
            shutil.rmtree(str(vid_path))

        # Check if the save_path exists. If not, create the directory
        vid_path.mkdir(parents=True, exist_ok=True)
        cap = cv2.VideoCapture(str(v))
        count = 0

        for _ in tqdm(range(int(cap.get(cv2.CAP_PROP_FRAME_COUNT))), leave=False):
            success, image = cap.read()
            if not success:
                break

            count += 1
            cv2.imwrite(f"{str(vid_path)}/{count}.jpg", image)
            if count >= 200:
                break
        cap.release()

        # count frames in the directory
        length = list(vid_path.glob('*.jpg'))
        name = "vid_" + str(idx)
        with open (f"./{args.save_path}/{user_id}/{args.label_name}", 'a+') as f:
            if v.stem.split('_')[-1] == "發球":
                f.write(f"{name} {len(length)} 0\n")
            else:
                f.write(f"{name} {len(length)} 1\n")

if __name__ == '__main__':
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument('--root', type=str, default='downloads')
    parser.add_argument('--save-path', type=str, default='frames')
    parser.add_argument('--label-name', type=str, default='QAQ.txt')
    parser.add_argument('--remove-frames', action='store_true', default=False,
                        help='Remove the frames if it exists')
    parser.add_argument('--remove-label', action='store_true', default=False,
                        help='Remove the label if it exists')
    parser.add_argument('user_id', type=str, help='The user ID')
    args = parser.parse_args()
    V2F(args, args.user_id)