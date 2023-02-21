import './PlusButton.css';

function PlusButton() {
    return (
        <div>
            <div className="floating-btn">
                <img src={require('../Images/PlusIcon.png')} />
            </div>
        </div>
    )
}

export default PlusButton