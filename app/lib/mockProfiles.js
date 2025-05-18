"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockProfiles = void 0;
var maleNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Bob', 'Alex', 'Chris', 'Daniel', 'Matthew', 'Anthony', 'Mark', 'Donald', 'Steven', 'Paul'];
var femaleNames = ['Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Margaret', 'Sandra', 'Ashley', 'Kimberly', 'Emily', 'Donna', 'Michelle'];
var bios = [
    'Loves hiking, coffee, and good books.',
    'A foodie and traveler. Let\'s explore the world together!',
    'Music, art, and yoga enthusiast.',
    'Enjoys running marathons and cooking new recipes.',
    'Passionate about technology and design.',
    'Dog lover and aspiring photographer.',
    'Always up for an adventure or a cozy night in.',
    'Fitness junkie and movie buff.',
    'Dreaming of traveling the world.',
    'Looking for someone to share laughs and good times.',
];
var locations = [
    'San Francisco, CA', 'New York, NY', 'Austin, TX', 'Chicago, IL', 'Seattle, WA',
    'Boston, MA', 'Denver, CO', 'Miami, FL', 'Portland, OR', 'Los Angeles, CA',
];
var interestsList = [
    'Hiking', 'Reading', 'Coffee', 'Travel', 'Food', 'Photography', 'Music', 'Art', 'Yoga',
    'Running', 'Cooking', 'Movies', 'Fitness', 'Dancing', 'Tech', 'Design', 'Dogs', 'Cats', 'Outdoors', 'Gaming',
];
var jobs = [
    'Software Engineer', 'Product Manager', 'Graphic Designer', 'Teacher', 'Nurse', 'Doctor',
    'Photographer', 'Chef', 'Writer', 'Artist', 'Marketing Specialist', 'Sales Manager', 'Consultant',
    'Architect', 'Engineer', 'Researcher', 'Entrepreneur', 'Barista', 'Musician', 'Trainer',
];
var educations = [
    'Stanford University', 'NYU', 'UT Austin', 'MIT', 'Harvard', 'UCLA', 'UC Berkeley', 'Yale', 'Princeton', 'Columbia',
];
var maleImages = [
    'assets/images/pexels-olly-785667.jpg',
    'assets/images/pexels-pixabay-458766.jpg',
    'assets/images/pexels-moose-photos-170195-1036620.jpg',
    'assets/images/pexels-bertellifotografia-573299.jpg',
    'assets/images/pexels-olly-712513.jpg',
    'assets/images/pexels-vinicius-wiesehofer-289347-1130626.jpg',
    'assets/images/pexels-juanpphotoandvideo-1139743.jpg',
    'assets/images/pexels-brett-sayles-1073097.jpg',
    'assets/images/pexels-samad-ismayilov-231721-1270076.jpg',
    'assets/images/pexels-mostafasanadd-868113.jpg',
    'assets/images/pexels-linkedin-2182970.jpg',
    'assets/images/pexels-stefanstefancik-91227.jpg',
    'assets/images/pexels-danxavier-1121796.jpg',
    'assets/images/pexels-justin-shaifer-501272-1222271.jpg',
    'assets/images/pexels-simon-robben-55958-614810.jpg',
    'assets/images/pexels-olly-874158.jpg',
    'assets/images/pexels-italo-melo-881954-2379004.jpg',
];
var femaleImages = [
    'assets/images/pexels-godisable-jacob-226636-718978.jpg',
    'assets/images/pexels-olly-774095.jpg',
    'assets/images/pexels-anastasiya-gepp-654466-2065195.jpg',
    'assets/images/pexels-divinetechygirl-1181690.jpg',
    'assets/images/pexels-hannah-nelson-390257-1065084.jpg',
    'assets/images/pexels-pixabay-415829.jpg',
    'assets/images/pexels-olly-774909.jpg',
    'assets/images/pexels-olly-733872.jpg',
    'assets/images/pexels-moose-photos-170195-1036623.jpg',
    'assets/images/pexels-kebs-visuals-742415-3992656.jpg',
    'assets/images/pexels-italo-melo-881954-2379005.jpg',
    'assets/images/pexels-chloekalaartist-1043473.jpg',
    'assets/images/pexels-elletakesphotos-1680175.jpg',
    'assets/images/pexels-moose-photos-170195-1036627.jpg',
    'assets/images/pexels-divinetechygirl-1181391.jpg',
    'assets/images/pexels-olly-846741.jpg',
    'assets/images/pexels-chloekalaartist-1043474.jpg',
];
function getRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function getRandomInterests() {
    var shuffled = interestsList.sort(function () { return 0.5 - Math.random(); });
    return shuffled.slice(0, Math.floor(Math.random() * 4) + 2);
}
function getRandomAge() {
    return Math.floor(Math.random() * 18) + 21; // 21-38
}
function getRandomGender() {
    return Math.random() < 0.5 ? 'Male' : 'Female';
}
function getRandomName(gender) {
    return gender === 'Male' ? getRandom(maleNames) : getRandom(femaleNames);
}
exports.mockProfiles = Array.from({ length: 100 }, function (_, i) {
    var gender = getRandomGender();
    var photo = gender === 'Male'
        ? maleImages[i % maleImages.length]
        : femaleImages[i % femaleImages.length];
    return {
        id: (i + 1).toString(),
        name: getRandomName(gender),
        age: getRandomAge(),
        bio: getRandom(bios),
        photo: photo,
        location: getRandom(locations),
        gender: gender,
        interests: getRandomInterests(),
        job: getRandom(jobs),
        education: getRandom(educations),
    };
});
