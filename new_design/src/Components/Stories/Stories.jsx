import React from 'react';
import styles from './Stories.module.css';
import story1 from '../../assets/profile1.jpg';
import story2 from '../../assets/profile2.jpg';
import story3 from '../../assets/profile3.jpg';
import { useNavigate } from 'react-router-dom';

const stories = [
  { src: story1, name: 'My Story', isMyStory: true },
  { src: story2, name: 'Selena', viewed: false },
  { src: story3, name: 'Clara', viewed: true },
];

const Stories = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.storiesSection}>
      <div className={styles.storiesWrapper}>
        <div className={styles.stories}>
          {stories.map((story, index) => (
            <div
              key={index}
              className={styles.story}
              onClick={() => !story.isMyStory && navigate("/viewstory")}
              tabIndex={story.isMyStory ? -1 : 0}
              role={story.isMyStory ? undefined : "button"}
            >
              <div className={`${styles.storyImage} ${story.isMyStory ? styles.myStory : ''} ${story.viewed ? styles.viewed : ''}`}>
                <div className={styles.storyImageContainer}>
                  <img src={story.src} alt={story.name} />
                </div>
                {story.isMyStory && <div className={styles.addIcon}>+</div>}
              </div>
              <p>{story.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stories;
